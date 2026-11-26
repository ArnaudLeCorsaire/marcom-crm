#!/usr/bin/env python3
"""
Konex – serveur pour Domino (ou tout hôte avec un volume persistant).

Il sert Konex.html et range TOUTES les données dans un dossier clair sur la machine,
au lieu du stockage du navigateur et des dossiers choisis à la main :

    <KONEX_DATA_DIR>/
        base-partagee/          base de l'équipe (édition publiée, contributions, documents chiffrés)
        espaces/<utilisateur>/  données de chaque utilisateur (coffres chiffrés, module d'import)
        master/                 déposez ici la master file Excel : Konex la propose à l'import
        exports/                tout ce que Konex exporte (Excel, CSV, .ics…) y est aussi enregistré

Le dossier de données est choisi ainsi :
    1. la variable d'environnement KONEX_DATA_DIR, si elle est définie ;
    2. sinon un dataset Domino nommé « konex » s'il existe
       (/domino/datasets/local/konex ou /mnt/data/konex) ;
    3. sinon ./data à côté de ce fichier (pratique en local, mais NON persistant sur Domino :
       le dossier du projet est remis à zéro à chaque redémarrage de l'app).

Sur Domino, définissez-la dans App Settings → Environment Variables, par exemple :
    KONEX_DATA_DIR=/domino/datasets/local/<votre-dataset>/konex     (projet Domino File System)
    KONEX_DATA_DIR=/mnt/data/<votre-dataset>/konex                   (projet Git)

Les coffres et la base de l'équipe sont chiffrés dans le navigateur (AES-GCM 256) :
le serveur ne voit et n'enregistre que des données chiffrées. Seuls master/ et exports/
contiennent des fichiers en clair (ce sont vos fichiers Excel).

Aucune dépendance : Python 3.8+ (bibliothèque standard).
"""
import json
import os
import re
import sys
import tempfile
import threading
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit

APP_DIR = Path(__file__).resolve().parent
HTML_FILE = Path(os.environ.get("KONEX_HTML", APP_DIR / "Konex.html"))
MAX_BODY = int(os.environ.get("KONEX_MAX_MB", "300")) * 1024 * 1024
DATASET_CANDIDATES = ["/domino/datasets/local/konex", "/domino/datasets/konex", "/mnt/data/konex"]


def pick_data_dir():
    env = os.environ.get("KONEX_DATA_DIR", "").strip()
    if env:
        return Path(env).expanduser(), "KONEX_DATA_DIR"
    for c in DATASET_CANDIDATES:
        if Path(c).is_dir():
            return Path(c), "dataset"
    return APP_DIR / "data", "defaut"


DATA_DIR, DATA_SRC = pick_data_dir()
AREAS = {"base": "base-partagee", "master": "master", "exports": "exports"}


def is_persistent(p: Path) -> bool:
    s = str(p.resolve())
    if os.environ.get("KONEX_PERSISTENT", "").lower() in ("1", "true", "oui", "yes"):
        return True
    if s.startswith(("/domino/datasets", "/mnt/data", "/mnt/imported", "/domino/edv")):
        return True
    # hors Domino (poste local, serveur classique) : on considère le disque comme persistant
    return not (os.environ.get("DOMINO_RUN_ID") or os.environ.get("DOMINO_PROJECT_NAME"))


PERSISTENT = is_persistent(DATA_DIR)
LOCKS = {}
LOCKS_GUARD = threading.Lock()


def lock_for(path: Path):
    with LOCKS_GUARD:
        lk = LOCKS.get(str(path))
        if lk is None:
            lk = LOCKS[str(path)] = threading.Lock()
        return lk


def safe_name(s: str) -> str:
    """Nom d'utilisateur → nom de dossier sûr."""
    s = re.sub(r"[^A-Za-z0-9._@-]+", "_", s or "").strip("._")
    return s[:80] or "local"


def resolve_in(root: Path, rel: str) -> Path:
    """Chemin relatif → chemin absolu, toujours à l'intérieur de root."""
    parts = [p for p in rel.split("/") if p not in ("", ".")]
    for p in parts:
        if p == ".." or "\x00" in p or p.startswith("~"):
            raise PermissionError(rel)
    full = root.joinpath(*parts) if parts else root
    full_r = full.resolve()
    root_r = root.resolve()
    if full_r != root_r and root_r not in full_r.parents:
        raise PermissionError(rel)
    return full


def atomic_write(path: Path, data: bytes):
    path.parent.mkdir(parents=True, exist_ok=True)
    with lock_for(path):
        fd, tmp = tempfile.mkstemp(prefix=".tmp-", dir=str(path.parent))
        try:
            with os.fdopen(fd, "wb") as f:
                f.write(data)
                f.flush()
                os.fsync(f.fileno())
            os.replace(tmp, path)
        except BaseException:
            try:
                os.unlink(tmp)
            except OSError:
                pass
            raise


def key_file(key: str) -> str:
    return quote(key, safe="") + ".json"


def mtime_ms(p: Path) -> int:
    return int(p.stat().st_mtime * 1000)


class Handler(BaseHTTPRequestHandler):
    server_version = "Konex"
    protocol_version = "HTTP/1.1"

    # ---------- utilitaires ----------
    def log_message(self, fmt, *args):
        if os.environ.get("KONEX_LOG"):
            sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def user(self) -> str:
        # Domino transmet l'identité de la personne connectée dans l'en-tête « domino-username »
        u = self.headers.get("domino-username") or os.environ.get("KONEX_USER") or "local"
        if u.lower() == "anonymous":
            u = "anonyme"
        return safe_name(u)

    def send(self, code, body=b"", ctype="application/json; charset=utf-8", extra=None):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode("utf-8")
        elif isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def err(self, code, msg):
        self.send(code, {"error": msg})

    def body(self) -> bytes:
        n = int(self.headers.get("Content-Length") or 0)
        if n > MAX_BODY:
            raise ValueError("trop volumineux")
        return self.rfile.read(n) if n else b""

    def route(self):
        """Chemin sans le préfixe éventuel ajouté par le proxy Domino : on cherche « /api/ »."""
        path = urlsplit(self.path).path
        i = path.find("/api/")
        if i < 0:
            return None, []
        rest = path[i + 5:]
        parts = rest.split("/", 1)
        return parts[0], [unquote(parts[1])] if len(parts) > 1 else []

    def area_path(self, rel: str):
        area, _, sub = rel.partition("/")
        if area not in AREAS:
            raise PermissionError(area)
        return resolve_in(DATA_DIR / AREAS[area], sub)

    def kv_root(self) -> Path:
        return DATA_DIR / "espaces" / self.user()

    # ---------- page ----------
    def serve_page(self):
        try:
            html = HTML_FILE.read_text(encoding="utf-8")
        except OSError:
            return self.err(500, "Konex.html introuvable : %s" % HTML_FILE)
        # la page autorise les appels vers ce serveur uniquement (et rien d'autre)
        html = html.replace("connect-src 'none'", "connect-src 'self'")
        info = self.info()
        inject = "<script>window.KONEX_SERVER=%s;</script>" % json.dumps(info, ensure_ascii=False).replace("</", "<\\/")
        html = html.replace("<head>", "<head>" + inject, 1)
        self.send(200, html, "text/html; charset=utf-8", {"Referrer-Policy": "no-referrer"})

    def info(self):
        return {
            "on": True,
            "dataDir": str(DATA_DIR),
            "source": DATA_SRC,
            "persistent": PERSISTENT,
            "user": self.user(),
            "dirs": {**{k: str(DATA_DIR / v) for k, v in AREAS.items()}, "espaces": str(DATA_DIR / "espaces" / self.user())},
            "domino": bool(os.environ.get("DOMINO_PROJECT_NAME") or os.environ.get("DOMINO_RUN_ID")),
        }

    # ---------- verbes ----------
    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        name, args = self.route()
        try:
            if name is None:
                return self.serve_page()
            if name == "info":
                return self.send(200, self.info())
            if name == "kv":
                return self.kv_get(args[0] if args else "")
            if name == "ls":
                return self.fs_ls(args[0] if args else "")
            if name == "fs":
                return self.fs_get(args[0] if args else "")
            return self.err(404, "inconnu")
        except PermissionError:
            return self.err(403, "chemin refusé")
        except Exception as e:  # pragma: no cover
            return self.err(500, str(e))

    def do_PUT(self):
        name, args = self.route()
        try:
            data = self.body()
            if name == "kv":
                db, _, key = (args[0] if args else "").partition("/")
                if not db or not key:
                    return self.err(400, "clé manquante")
                atomic_write(resolve_in(self.kv_root(), safe_name(db)) / key_file(key), data)
                return self.send(200, {"ok": True})
            if name == "fs":
                p = self.area_path(args[0] if args else "")
                if p.is_dir():
                    return self.err(409, "c'est un dossier")
                atomic_write(p, data)
                return self.send(200, {"ok": True, "mtime": mtime_ms(p)})
            return self.err(404, "inconnu")
        except PermissionError:
            return self.err(403, "chemin refusé")
        except ValueError as e:
            return self.err(413, str(e))
        except Exception as e:  # pragma: no cover
            return self.err(500, str(e))

    def do_POST(self):
        name, args = self.route()
        try:
            self.body()
            if name == "mkdir":
                p = self.area_path(args[0] if args else "")
                if p.exists() and not p.is_dir():
                    return self.err(409, "c'est un fichier")
                p.mkdir(parents=True, exist_ok=True)
                return self.send(200, {"ok": True})
            return self.err(404, "inconnu")
        except PermissionError:
            return self.err(403, "chemin refusé")
        except Exception as e:  # pragma: no cover
            return self.err(500, str(e))

    def do_DELETE(self):
        name, args = self.route()
        try:
            if name == "kv":
                db, _, key = (args[0] if args else "").partition("/")
                d = resolve_in(self.kv_root(), safe_name(db))
                if key:
                    f = d / key_file(key)
                    if f.exists():
                        with lock_for(f):
                            f.unlink()
                elif d.is_dir():
                    for f in d.glob("*.json"):
                        f.unlink()
                return self.send(200, {"ok": True})
            if name == "fs":
                p = self.area_path(args[0] if args else "")
                if p.is_file():
                    with lock_for(p):
                        p.unlink()
                elif p.is_dir():
                    try:
                        p.rmdir()
                    except OSError:
                        return self.err(409, "dossier non vide")
                return self.send(200, {"ok": True})
            return self.err(404, "inconnu")
        except PermissionError:
            return self.err(403, "chemin refusé")
        except Exception as e:  # pragma: no cover
            return self.err(500, str(e))

    # ---------- espaces (remplace le stockage du navigateur) ----------
    def kv_get(self, rel):
        db, _, key = rel.partition("/")
        root = self.kv_root()
        if not db:
            dbs = sorted(p.name for p in root.iterdir() if p.is_dir()) if root.is_dir() else []
            return self.send(200, {"dbs": dbs})
        d = resolve_in(root, safe_name(db))
        if not key:
            keys = sorted(unquote(f.name[:-5]) for f in d.glob("*.json")) if d.is_dir() else []
            return self.send(200, {"keys": keys, "exists": d.is_dir()})
        f = d / key_file(key)
        if not f.is_file():
            return self.err(404, "absent")
        return self.send(200, f.read_bytes())

    # ---------- fichiers (base partagée, master, exports) ----------
    def fs_ls(self, rel):
        p = self.area_path(rel)
        if not p.is_dir():
            return self.err(404, "absent")
        out = []
        for c in sorted(p.iterdir(), key=lambda x: x.name.lower()):
            if c.name.startswith(".tmp-"):
                continue
            st = c.stat()
            out.append({"name": c.name, "kind": "directory" if c.is_dir() else "file",
                        "size": st.st_size, "mtime": int(st.st_mtime * 1000)})
        return self.send(200, {"entries": out})

    def fs_get(self, rel):
        p = self.area_path(rel)
        if not p.is_file():
            return self.err(404, "absent")
        with lock_for(p):
            data = p.read_bytes()
            mt = mtime_ms(p)
        return self.send(200, data, "application/octet-stream", {"X-Mtime": str(mt)})


def main():
    host = os.environ.get("KONEX_HOST", "0.0.0.0")
    port = int(os.environ.get("KONEX_PORT", os.environ.get("PORT", "8888")))
    try:
        for v in list(AREAS.values()) + ["espaces"]:
            (DATA_DIR / v).mkdir(parents=True, exist_ok=True)
        probe = DATA_DIR / ".ecriture-ok"
        probe.write_text(time.strftime("%Y-%m-%d %H:%M:%S"))
        probe.unlink()
    except OSError as e:
        sys.exit("Konex : impossible d'écrire dans %s (%s). Vérifiez KONEX_DATA_DIR." % (DATA_DIR, e))
    print("Konex : http://%s:%d/" % (host, port))
    print("Konex : données dans %s (%s)%s" % (DATA_DIR, DATA_SRC, "" if PERSISTENT else
          "  ⚠ NON PERSISTANT : définissez KONEX_DATA_DIR vers un dataset Domino"))
    ThreadingHTTPServer.daemon_threads = True
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    main()

#!/usr/bin/env bash
# Lancement de Konex comme application Domino (Domino exécute app.sh et attend l'app sur le port 8888).
# Dossier des données : variable KONEX_DATA_DIR (App Settings → Environment Variables), voir README.
set -e
cd "$(dirname "$0")"
exec python3 konex_server.py

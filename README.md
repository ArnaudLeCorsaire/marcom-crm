# Konex — by MarCom

**Konex** est l'outil de gestion des contacts et des événements de l'équipe MarCom : recherche de personnes, d'entreprises, de CMO et d'événements, construction de listes d'invités, statistiques de participation et contrôle qualité des données.

Il tient entièrement dans **un seul fichier HTML** (`Konex.html`), fonctionne **100 % hors ligne**, sans serveur, sans installation et sans aucune bibliothèque externe. À l'ouverture, on choisit l'**espace utilisateur** ou l'**espace administrateur** et on saisit le mot de passe ; les données sont **chiffrées** sur le poste.

> 🖥️ **Sur Domino** (ou tout serveur) : lancez `app.sh`. Konex range alors toutes ses données dans des fichiers d'un dossier fixe (un dataset Domino), sans rien choisir à la main. Voir [Déployer sur Domino](#déployer-sur-domino).

> ⏳ **Mode actuel (avant la mise en ligne) : un mot de passe par espace et par poste**, comme dans les versions précédentes. Les comptes personnels (fichier `konex-utilisateurs.json`) sont prêts dans le code mais **désactivés** ; ils seront activés à la mise en ligne (voir [Comptes et connexion](#comptes-et-connexion)).

---

## Sommaire

1. [Contenu du dépôt](#contenu-du-dépôt)
2. [Un fichier, deux espaces](#un-fichier-deux-espaces)
3. [Démarrage rapide](#démarrage-rapide)
   - [Déployer sur Domino](#déployer-sur-domino)
4. [Comptes et connexion](#comptes-et-connexion)
5. [Fonctionnalités communes](#fonctionnalités-communes)
6. [Arno, l'assistant](#arno-lassistant)
7. [Préparer un événement à venir](#préparer-un-événement-à-venir)
7. [Fonctionnalités réservées à l'espace administrateur](#fonctionnalités-réservées-à-lespace-administrateur)
8. [Construction de la master file (Importer et contrôler)](#construction-de-la-master-file-importer-et-contrôler)
9. [Konex et « Importer et contrôler » en miroir](#konex-et--importer-et-contrôler--en-miroir)
10. [Base partagée et travail en équipe](#base-partagée-et-travail-en-équipe)
11. [Sécurité et conformité](#sécurité-et-conformité)
12. [Formats de fichiers](#formats-de-fichiers)
13. [Navigateurs compatibles](#navigateurs-compatibles)
14. [Glossaire](#glossaire)
15. [FAQ et dépannage](#faq-et-dépannage)
16. [Architecture technique](#architecture-technique)
17. [Historique des versions](#historique-des-versions)

---

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `Konex.html` | **L'outil**, pour tout le monde. À l'ouverture, deux fenêtres de connexion : **espace utilisateur** et **espace administrateur**. |
| `konex-utilisateurs.json` | *(créé par Konex, pas dans ce dépôt)* Le fichier des comptes, à la racine du dossier Konex sur le réseau. Voir [Comptes et connexion](#comptes-et-connexion). |
| `old/` | Anciennes versions archivées (`Konex-2.html`, `Konex_admin-2.html`, `Konex.html` v1, `Konex_admin.html` v1, `MarCom_CRM_admin-3/4/5.html`, `MarCom_CRM_standard-3/4.html`). Conservées pour mémoire, **ne plus les utiliser**. |
| `konex_server.py` | Petit serveur Python (bibliothèque standard uniquement) pour Domino : sert `Konex.html` et range toutes les données dans des fichiers. |
| `app.sh` | Script de lancement de l'app Domino (port 8888). |
| `README.md` | Ce document. |

---

## Un fichier, deux espaces

Les anciennes éditions standard et admin sont réunies dans **un seul fichier**, `Konex.html`. L'écran de connexion propose deux onglets :

- **Espace utilisateur** — ouvert à tous les comptes (y compris les administrateurs qui veulent voir l'outil comme l'équipe) ;
- **Espace administrateur** — réservé aux comptes ayant le rôle *Administrateur*.

L'espace choisi à la connexion décide de ce qui est disponible :

| Capacité | Espace utilisateur | Espace administrateur |
|---|:---:|:---:|
| Rechercher (personnes, CMO, entreprises, RMPM, événements) | ✅ | ✅ |
| Poser une question en langage naturel | ✅ | ✅ |
| Consulter et copier une fiche, préparer un e-mail | ✅ | ✅ |
| Construire et exporter des listes | ✅ | ✅ |
| Statistiques et tableau de bord | ✅ | ✅ |
| Modifier toutes les fiches (personnes, entreprises, CMO, événements, participants), notes, photos, créer un contact ou un événement | ✅ (appliqué tout de suite, journalisé) | ✅ |
| Signaler une erreur ou un doublon | ✅ | — |
| Changer son mot de passe | ✅ | ✅ |
| Archiver une fiche, changement d'entreprise | ✅ | ✅ |
| Fusionner des doublons, supprimer | ❌ (utiliser « Signaler ») | ✅ |
| Importer des données / construire la master file | ❌ | ✅ |
| Contrôles qualité (doublons, inversions, fautes…) | ❌ | ✅ |
| Journal des modifications (voir, annuler au cas par cas) | ❌ | ✅ |
| Publier l'édition pour l'équipe | ❌ | ✅ |
| **Gérer les comptes (Utilisateurs)** | ❌ | ✅ |
| Sauvegarder / restaurer | ❌ | ✅ |

Chaque espace garde ses propres données sur le poste (`marcom-crm-standard` pour l'espace utilisateur, `marcom-searching-tool` pour l'espace administrateur, dans le stockage du navigateur). Les données déjà présentes des anciennes versions sont reprises automatiquement.

---

## Démarrage rapide

### Utilisateur

1. Ouvrez `Konex.html` dans **Microsoft Edge** ou **Google Chrome**.
2. Onglet **Espace utilisateur**. La première fois sur ce poste, **choisissez un mot de passe** (au moins 8 caractères) : il chiffre les données de cet espace. Ensuite, saisissez-le à chaque ouverture.
3. Suivez le **didacticiel** (≈ 3 min 30, 5 gestes essentiels sur des données fictives).
4. **Données › Base partagée** : connectez le dossier de l'équipe avec la **clé d'équipe** transmise par un administrateur, puis chargez la dernière **édition publiée**.

### Administrateur

1. Onglet **Espace administrateur** : choisissez le mot de passe de cet espace la première fois, puis saisissez-le à chaque ouverture. Les données des anciennes versions s'ouvrent avec leur mot de passe actuel.
2. **Administration › Importer et contrôler** : déposez les fichiers Excel/CSV (listes d'invités, réponses, présences) et, si disponible, le référentiel RMPM.
3. Suivez les 6 étapes (voir [Construction de la master file](#construction-de-la-master-file-importer-et-contrôler)), puis **Envoyer dans Konex**.
4. Traitez les **Contrôles qualité** du menu de gauche.
5. **Base partagée** : créez le dossier partagé (une seule fois) avec une clé d'équipe d'au moins 12 caractères, puis **Publier l'édition pour l'équipe**.
6. Pensez à **Sauvegarder** régulièrement (fichier chiffré).

> 💡 Pas encore de fichier ? Le module d'import propose des **données d'exemple « pleines de pièges »** pour tester l'outil.

---

## Déployer sur Domino

Ouvert directement comme fichier, Konex garde ses données dans le navigateur et la base de l'équipe dans un dossier choisi à la main. Sur **Domino**, l'espace de travail du projet est remis à zéro à chaque redémarrage de l'app : il faut donc ranger les données sur un **dataset** (stockage persistant). C'est ce que fait `konex_server.py`.

### Mise en place (une fois)
1. Créez un **dataset** dans le projet Domino, par exemple `konex`.
2. Dans **App Settings → Environment Variables**, ajoutez :

   | Variable | Valeur |
   |---|---|
   | `KONEX_DATA_DIR` | `/domino/datasets/local/konex/konex` (projet Domino File System) ou `/mnt/data/konex/konex` (projet Git) |

   Sans cette variable, Konex utilise tout seul un dataset nommé `konex` s'il le trouve (`/domino/datasets/local/konex` ou `/mnt/data/konex`). Sinon il écrit dans `./data`, qui **n'est pas persistant** sur Domino : Konex l'indique en orange sur l'écran de connexion.
3. Publiez l'app : Domino exécute `app.sh`, qui lance `python3 konex_server.py` sur le port 8888. Aucune dépendance à installer.

Pour essayer sur votre poste :

```bash
KONEX_DATA_DIR=~/konex-data python3 konex_server.py
```

Puis ouvrez `http://localhost:8888/`.

### Où sont les données

```
<KONEX_DATA_DIR>/
├── base-partagee/            base de l'équipe : édition publiée, contributions, documents des événements (chiffrés)
├── espaces/<utilisateur>/    données de chaque personne : coffre admin, coffre utilisateur, module d'import (chiffrés)
├── master/                   déposez-y la master file Excel : Konex la propose à l'import
└── exports/                  copie de tout ce que Konex exporte (Excel, CSV, .ics, master file…)
```

- **Plus aucun dossier à choisir** : la base de l'équipe est connectée automatiquement. Un administrateur la crée une fois (**Base partagée → Créer la base de l'équipe**, avec la clé d'équipe), puis chaque utilisateur la rejoint avec cette clé. Les connexions suivantes la retrouvent toutes seules.
- **Master file** : dans *Importer et contrôler*, le bouton d'import ouvre la liste des fichiers du dossier `master/` (le plus récent est coché). *Depuis cet ordinateur…* reste possible.
- **Exports** : chaque fichier exporté est téléchargé comme d'habitude **et** rangé dans `exports/`.
- **Un espace par personne** : Konex sépare les données de chaque personne grâce à l'identité que Domino transmet à l'app (en-tête `domino-username`). Le nom reconnu est affiché dans **Base partagée → Stockage Domino**. Si Domino ne transmet pas l'identité, tout le monde partage l'espace `local` : définissez alors `KONEX_USER` ou vérifiez les réglages d'identité de l'app.
- **Sécurité** : le chiffrement reste fait dans le navigateur (AES-GCM 256). Le serveur ne reçoit et n'écrit que des données chiffrées, sauf dans `master/` et `exports/`, qui contiennent vos fichiers Excel. Les chemins sont vérifiés (impossible de sortir du dossier des données) et chaque écriture est atomique (fichier temporaire puis remplacement).
- La page **Base partagée** montre tous ces chemins dans le bloc **Stockage Domino**.

### Variables disponibles

| Variable | Rôle | Défaut |
|---|---|---|
| `KONEX_DATA_DIR` | Dossier des données (sur un dataset) | dataset `konex` détecté, sinon `./data` |
| `KONEX_PORT` | Port d'écoute | `8888` |
| `KONEX_USER` | Nom de l'espace si Domino ne transmet pas l'identité | `local` |
| `KONEX_MAX_MB` | Taille maximale d'un fichier envoyé | `300` |
| `KONEX_PERSISTENT` | `1` pour déclarer persistant un autre volume monté | — |
| `KONEX_LOG` | `1` pour journaliser les requêtes | — |

Si plusieurs personnes écrivent beaucoup en même temps, le passage à une vraie base de données (SQLite, Postgres) ne toucherait que `konex_server.py` : les fonctions `kv_get` / `do_PUT` (espaces) et `fs_*` (fichiers).

## Comptes et connexion

### Mode actuel : un mot de passe par espace

En attendant la mise en ligne, Konex fonctionne comme les versions précédentes :

- chaque espace (**utilisateur** / **administrateur**) a **son propre mot de passe, propre à ce poste** ;
- il est choisi à la première ouverture de l'espace (au moins 8 caractères) et **chiffre les données de cet espace** (AES-GCM 256, PBKDF2-SHA-256) ;
- **Mon mot de passe** (menu de gauche) permet de le changer : les données sont rechiffrées ;
- en haut du menu, sous le logo : l'espace actif, **Verrouiller** et **Vue standard / Vue admin** :
  - depuis l'espace administrateur, **Vue standard** affiche immédiatement l'outil tel que le voit un utilisateur standard, **sans mot de passe** (« Aperçu standard »), sur les données de l'administrateur. Pendant l'aperçu, rien n'est échangé avec la base partagée. **Vue admin** revient à l'espace administrateur, toujours sans mot de passe ; verrouiller pendant l'aperçu rouvre la connexion administrateur ;
  - depuis un vrai espace utilisateur, **Vue admin** verrouille et demande le mot de passe administrateur ;
- à chaque connexion, Konex s'ouvre sur l'onglet **Événements**, quel que soit l'endroit où on l'a quitté ;
- la session se **verrouille automatiquement après 20 minutes** d'inactivité ;
- dans l'espace administrateur, les sections **Administration** et **Contrôles qualité** du menu se **replient** d'un clic sur leur titre (petite flèche). Repliée, la section affiche le total des points à traiter. L'état est mémorisé ;
- verrouiller et changer d'espace **ne rechargent pas la page** : les données déchiffrées sont retirées de la mémoire et de l'écran, puis l'écran de connexion réapparaît. Cela fonctionne aussi quand Konex est ouvert dans un aperçu qui interdit le rechargement ;
- **Mot de passe oublié ?** efface les données de cet espace sur ce poste pour repartir de zéro ;
- les données des anciennes versions (`Konex-2.html`, `Konex_admin-2.html`…) s'ouvrent directement avec leur mot de passe actuel.

⚠️ Dans ce mode, rien n'empêche quelqu'un d'ouvrir l'espace administrateur sur son poste en choisissant un mot de passe : la séparation des rôles n'arrivera qu'avec les comptes personnels ci-dessous.

### À la mise en ligne : comptes personnels (prêts, désactivés)

Pour les activer, remplacer `const AUTH_MODE='local';` par `const AUTH_MODE='accounts';` dans `Konex.html`. Konex demande alors de choisir le dossier Konex sur le réseau, crée `konex-utilisateurs.json` à sa racine avec le premier administrateur, et ajoute la page **Administration › Utilisateurs**. Ce qui suit décrit ce mode.

### Le fichier des comptes : `konex-utilisateurs.json`

Il se trouve **à la racine du dossier Konex** et contient, pour chaque compte : identifiant, prénom et nom, rôle (*Utilisateur* ou *Administrateur*), état (actif / désactivé) et des éléments cryptographiques. **Aucun mot de passe n'y est écrit**, ni en clair ni chiffré de façon réversible :

| Protection | Détail |
|---|---|
| **Empreinte du mot de passe** | PBKDF2-SHA-256, **600 000 itérations**, sel aléatoire de 16 octets propre à chaque compte. Seule l'empreinte est stockée : elle permet de vérifier un mot de passe, pas de le retrouver. |
| **Signature des comptes et des rôles** | La liste des comptes, leurs rôles et leur état sont **signés (ECDSA P-256)** avec la clé des administrateurs. Ajouter un compte ou se donner le rôle administrateur en modifiant le fichier à la main **rend la signature invalide : la connexion est refusée**. |
| **Signature des identifiants de chaque compte** | Chaque compte signe ses propres identifiants avec sa clé personnelle : personne ne peut remplacer le mot de passe d'un autre pour prendre sa place. |
| **Clés privées chiffrées** | Clés personnelles chiffrées en **AES-GCM 256** avec une clé tirée du mot de passe de leur titulaire ; la clé des administrateurs est chiffrée pour chaque administrateur (ECDH P-256 + HKDF + AES-GCM). |
| **Retrait d'un administrateur** | Lui retirer le rôle, désactiver ou supprimer son compte **renouvelle la clé des administrateurs**. Le nouveau fichier reste reconnu par les postes grâce à une chaîne de clés signée. |
| **Protection contre le retour en arrière** | Chaque poste mémorise la dernière version vue du fichier : une ancienne copie remise à sa place est refusée. Si la clé de signature change sans chaîne valide (fichier recréé), le poste demande une confirmation explicite. |
| **Essais limités** | Après 3 erreurs, attente croissante avant un nouvel essai. Le message d'erreur ne dit pas si l'identifiant existe. |

Règles des mots de passe : **au moins 12 caractères, avec des lettres et des chiffres**.

### Gestion des comptes (administrateurs)

**Administration › Utilisateurs** : créer un compte, réinitialiser un mot de passe (nouveau mot de passe provisoire), passer un compte en administrateur ou en utilisateur, désactiver / réactiver, supprimer. Il reste toujours au moins un administrateur actif. Chaque modification relit le fichier à jour, le vérifie, le signe et le réécrit.

### Mon mot de passe (tout le monde)

Bouton **Mon mot de passe** dans le menu de gauche : saisir l'ancien puis le nouveau. Le fichier des comptes est mis à jour et les données de ce poste sont rechiffrées avec le nouveau mot de passe.

### Données de ce poste

Le mot de passe du compte **chiffre aussi les données enregistrées sur le poste** (même chiffrement qu'avant : AES-GCM 256, PBKDF2-SHA-256). Chaque compte a son propre espace chiffré sur un poste partagé.

- **Passage depuis une ancienne version** : à la première connexion, Konex demande **une seule fois l'ancien mot de passe du poste** et rechiffre les données avec le mot de passe du compte. Rien n'est perdu.
- **Mot de passe réinitialisé par un administrateur** : si vous ne vous souvenez plus de l'ancien, l'option « repartir de zéro sur ce poste » efface les données locales de cet espace ; les données de l'équipe se rechargent depuis la base partagée.

### Limites à connaître

Konex fonctionne sans serveur : toutes les vérifications se font dans le navigateur. Les signatures empêchent de **modifier le fichier des comptes** sans être administrateur, mais elles ne remplacent pas les droits du dossier réseau :

- seuls les membres de l'équipe doivent avoir accès au dossier Konex (droits gérés par l'IT) ;
- tous les utilisateurs ont besoin de l'**écriture** sur `konex-utilisateurs.json` pour pouvoir changer leur mot de passe ;
- quelqu'un qui modifie sa propre copie de `Konex.html` peut contourner l'interface **sur son poste**, mais il n'obtient ni les mots de passe des autres, ni la clé d'équipe de la base partagée, ni la possibilité de signer le fichier des comptes ;
- le fichier contient les identifiants et noms des membres (pas les mots de passe) : traitez-le comme une information interne.

### Navigateurs sans accès aux dossiers (Firefox, Safari)

Konex ne peut pas y mémoriser le dossier : il faut choisir le fichier `konex-utilisateurs.json` à chaque connexion, et les modifications des comptes **téléchargent** un nouveau fichier à remettre dans le dossier Konex. Edge ou Chrome sont recommandés.

---

## Fonctionnalités communes

### Rechercher
- Cinq onglets, **Événements** en premier : **Événements**, **Personnes**, **CMO**, **Entreprises** et **RMPM** (recherche par code RMPM : entreprises du référentiel et employés rattachés).
- Recherche instantanée par nom, société ou e-mail ; insensible aux accents et à la casse.
- **Filtres** rapides (Top 500, classements, entités…) et **Plus de filtres** pour les critères moins courants.
- **Filtres à choix multiples** : plusieurs valeurs d'un même filtre se cumulent en « ou » (ex. Top 500 **ou** Strategic ; régions Nord **et** Sud ; plusieurs valeurs d'un champ). Des filtres différents se combinent en « et ».
- Onglet **CMO** : plusieurs **entités** à la fois et filtre **Région** (plusieurs régions au choix).
- **Cocher plusieurs cases d'affilée** : dans toutes les listes à cases (filtres de recherche et création de liste), rien n'est recalculé pendant qu'on coche. On coche autant de cases que nécessaire, puis **Appliquer** (ou Entrée, ou un clic à côté) ; **Échap** annule. Les cases cochées s'affichent en étiquettes en haut de la liste (× pour en retirer une), avec le compteur en bas. Toute la ligne est cliquable. Avec une recherche, **Cocher les résultats** coche d'un coup tout ce qui correspond (ex. taper « Nord » puis tout cocher).
- **Filtre par année** et **tri** configurable (dernier import, dernière venue, plus de présences, plus de contacts, plus de clients…).
- Cliquez sur une carte pour ouvrir la **fiche détaillée**.

### Poser une question
Tapez une question en français dans la barre de recherche puis Entrée, par exemple :
- « Top 500 en Belgique jamais venus »
- « Qui de Lambert Capital était présent en 2025 ? »

Konex interprète classement, pays, entreprise, année et statut de présence, et affiche le résultat.

### Fiches
- **Fiche personne** : identité, photo, coordonnées, code RMPM de l'employeur en en-tête, bloc *Entreprise (employeur)*, CMO, indicateur **VIP**, historique des participations (replié, cliquez pour déplier), notes.
- **Historique détaillé** : chaque événement affiche son statut en couleur (présent, inscrit, absent, refusé, *Non inscrit*, *Non convié(e)*), y compris pour les sous-événements ; bouton **Copier l'historique…** pour le coller dans Teams ou un e-mail.
- **Compteurs sur les fiches** : inscriptions, présences et **taux de présence** (personnes, entreprises, CMO, événements).
- **Fiche entreprise** : code RMPM, classements (Top 1000/500, Strategic, Core 75, GSC, GNPC), secteur, géographie, Pilot CMO, logo, contacts.
- **Fiche CMO** et **fiche événement** (avec filtre par entreprise et filtres présents/absents).
- Actions en tête de fiche :
  - **Copier la fiche** — à coller dans Teams ou un e-mail ;
  - **E-mail** — message prêt avec l'historique, éditable avant copie (version mise en forme ou texte brut) ;
  - **Compléter** — ajouter un téléphone, un LinkedIn, une fonction, une information prévue par les administrateurs.
- Photos et logos : **glisser-déposer** d'une image puis **recadrage** (glisser pour positionner, curseur ou molette pour zoomer).
- Garde-fous de saisie : téléphone, LinkedIn (`linkedin.com/in/…`), site web, entreprise et secteur choisis dans une liste, détection des fiches proches avant création.
- Chaque modification est **signée** et peut être **annulée** juste après.

### Créer une liste
Un parcours guidé en trois étapes, avec des questions en langage courant, pour que quelqu'un qui n'est pas du métier s'y retrouve :
1. **Qui voulez-vous contacter ?** — *Des contacts* (clients, prospects, collègues) ou *Des CMO* (avec le nombre de leurs clients concernés).
2. **Comment les choisir ?** — toutes les questions sont visibles d'emblée ; on coche seulement celles qui comptent, et le nombre de personnes correspondantes s'affiche en direct (« → 9 contacts pour l'instant ») :
   - *Elles sont liées à un événement* (puis « Lesquelles ? » : toutes les personnes invitées, celles qui sont venues, celles qui ne sont pas venues, celles qui n'ont pas été invitées ; un statut précis reste disponible) ;
   - *Quel type de personnes ?* (tout le monde, externes, internes, CMO) ;
   - *Elles travaillent dans certaines entreprises* (rien n'est coché au départ : on coche celles qu'on veut) ;
   - *Elles sont suivies par certains CMO*, *Leur CMO est dans une région*, *Elles dépendent d'une entité*, *Leur entreprise a un classement* (si ces données existent) ;
   - *Leur fonction contient un mot*, *Ce sont des habitués* (venues au moins N fois, boutons − / +), *Seulement celles qu'on peut écrire* ;
   - *Plus de critères* : donnée du référentiel, information ajoutée aux fiches.

   Règle rappelée à l'écran : chaque critère coché réduit la liste ; dans un même critère, plusieurs choix veulent dire « l'un ou l'autre ».
3. **Votre liste** — le nombre, une phrase récapitulative, puis **Ajouter à un événement**, **Copier les e-mails**, **Préparer un e-mail**, **Télécharger (Excel)** et **Enregistrer cette liste**. Les listes enregistrées se reprennent d'un clic en haut de la page.

La barre de recherche en haut cherche une personne dans la liste obtenue.

En mode clients, avec 12 événements ou moins sélectionnés, une **colonne par événement** affiche le statut de chaque personne (également dans l'export).

### Statistiques
- Tableau de bord des événements, entreprises, participants et CMO.
- Graphiques SVG autonomes : barres, entonnoirs (invités → inscrits → présents), répartitions, comparaisons.
- Périmètre filtrable par année et comparaison entre périodes.
- Copie des données vers **Excel, PowerPoint ou e-mail**, export des graphiques en **image PNG**, export **Excel** (un onglet par tableau).
- Les personnes non invitées ne sont jamais comptées.

### Aide et didacticiel
- Page **Aide** : mode d'emploi, glossaire, tableau des droits selon l'édition.
- **Didacticiel** interactif rejouable à tout moment.
- Petites aides contextuelles affichées jusqu'au premier usage de l'élément concerné.

### Langue
Interface bilingue **français / anglais** : sélecteur FR | EN sur l'écran de connexion et en bas du menu. En anglais, les statuts de présence enregistrés en français dans les données (« Présent », « Refusé », « Sans réponse »…) sont traduits à l'affichage. Seul le module **Importer et contrôler** reste en français pour l'instant (un message le signale en anglais).

---

## Arno, l'assistant

Une fois connecté, **Arno** attend en bas à droite de l'écran (bulle avec sa photo — celle de la fiche d'Arnaud Tolon si elle existe dans Konex, sinon une illustration — et une pastille verte « en ligne »). Un clic ouvre la discussion, comme dans une messagerie :
- Arno commence toujours par « **Posez-moi n'importe quelle question et j'y répondrai.** » (« *Ask me anything and I'll answer.* » en anglais), avec quelques questions toutes prêtes à cliquer ;
- pendant qu'il cherche, les **trois petits points** s'affichent et l'en-tête indique « est en train d'écrire… » ; ses réponses arrivent en plusieurs bulles, avec l'heure, et vos messages passent à « ✓✓ Vu » ;
- un clic sur sa photo ouvre son **profil**, le crayon démarre une **nouvelle conversation**, la flèche réduit la fenêtre.

**Ce qu'il sait faire**
- **Comprendre la question entière**, en français ou en anglais (il répond dans la langue de la question) :
  - coordonnées : « le mail de Claire Dumont », « téléphone d'Éric Lambert », « que fait Sophie Bernard ? » ;
  - qui suit une entreprise : « qui est le CMO d'Ixor Conseil ? » ;
  - venues : « quand est-ce que Sophie Bernard est venue pour la dernière fois ? », « Jérôme Martin était-il au Forum ? », « Sophie est-elle déjà venue à un dîner ? » ;
  - listes de personnes avec autant de détails que nécessaire : entreprise, CMO, fonction (« les directeurs », « les CFO »), type d'événement (« dîner », « petit-déjeuner »), ville, statut (venus, absents, refus, sans réponse), et dates relatives (« cette année », « l'an dernier », « depuis septembre », « les 6 derniers mois ») ;
  - « qui n'est jamais venu ? », « les fidèles », « venus au moins 3 fois », « nouveaux contacts depuis septembre », « qui a changé d'entreprise ? » ;
  - événements : « quels événements en 2025 / à Bruxelles ? », prochains événements, classements, taux de présence ;
- **Agir, avec confirmation** : « Ajoute Sophie Bernard au Forum 2027 », « invite les clients de Bernard Avocats au prochain événement », « exporte les présents de la Matinale », « copie les mails de Lambert Capital ». Chaque réponse propose aussi **Ouvrir dans « Créer une liste »** avec les mêmes critères, **Copier les e-mails** et **Inviter au prochain événement**.
- **Demander plutôt que deviner** :
  - nom mal écrit ou incomplet → « Vouliez-vous dire « Bernard Avocats » ou plutôt « Sophie Bernard » ? » (fautes de frappe, lettres inversées, écriture phonétique comme « fintek ») ; s'il est presque sûr, il le dit : « Je pense que vous parlez de « Ixor Conseil » » ;
  - événement qui revient chaque année → « Il y a plusieurs éditions… Laquelle vous intéresse ? » ;
  - un nom seul (« Ixor », « 2025 ») → « Que voulez-vous savoir sur Ixor Conseil ? » avec les questions possibles ;
  - rien de reconnu → « Vous cherchez plutôt : une personne, une entreprise, un événement, de l'aide ? », puis « Quel est son nom ? Même approximatif ».
- **Questions sans réponse** : elles sont notées sur le poste ; un administrateur les retrouve dans le profil d'Arno (clic sur sa photo) pour les transmettre et enrichir Arno.
- **Fiabilité mesurée** : `tests/arno-test.js` pose automatiquement plus de 110 questions avec la réponse attendue (voir « Tests »).
- **Suivre la conversation** : après une réponse, « et en 2025 ? », « et les absents ? », « et chez Ixor ? » reprennent la question précédente.
- **Expliquer l'outil** : créer une liste, ajouter des invités, créer un événement, suivre les invitations, exporter, importer la master file, doublons, mot de passe, verrouillage, base partagée, photos, notes, langue — chaque fois avec un bouton qui y mène.
- **Discuter simplement** : bonjour, merci, au revoir… Si on lui demande s'il est un robot, il répond honnêtement qu'il est un assistant automatique.

**Il ne gêne pas la navigation** : la fenêtre flotte en bas à droite sans décaler la page (la page garde une marge en bas pour que la bulle ne recouvre rien). Ouvrir une fiche ou une page depuis Arno réduit la fenêtre en bulle (« Je reste là… ») et la fiche passe au premier plan ; la conversation est conservée. Rouvert pendant qu'une fiche est affichée, Arno se place à côté de la fiche quand l'écran est assez large. Sur téléphone, il s'ouvre en plein écran.

**Confidentialité** : Arno fonctionne entièrement sur ce poste, sans intelligence artificielle en ligne ni connexion réseau. La conversation n'est pas enregistrée et s'efface au verrouillage.

## Préparer un événement à venir

Konex ne fait plus seulement la synthèse du passé : il prépare les prochains événements, de la liste d'invités jusqu'au jour J.

### Créer un événement
Onglet **Événements**, bouton **+ Créer un événement**. Deux possibilités :
- **Partir de zéro** : nom, date, heure, lieu, type, événement principal (pour un side event), description et **photo d'illustration**, recadrée comme sur les autres fiches.
- **À partir d'un événement existant** : Konex reprend le nom, le lieu et le type, et propose l'**édition suivante** (année +1). On peut aussi reprendre les invités : tous, les présents, les absents et non-venus, ou la liste préparée.

Le bouton **Préparer l'édition suivante** existe aussi sur chaque page d'événement.

Un événement créé, depuis l'espace utilisateur comme administrateur, est **valable tout de suite** (plus d'étape « proposé / à valider »). Il arrive chez toute l'équipe par la base partagée.

### La page d'un événement
Un clic sur un événement ouvre une **page pleine largeur**. Les onglets dépendent de la date :
- événement **à venir** : *Vue d'ensemble* et *Invités et suivi* ;
- événement **passé** : *Vue d'ensemble* et *Participants* (pas de suivi d'invitations).

Si l'événement a une **photo**, elle sert de bandeau en haut de la page. Toute la page défile d'un seul bloc : le menu et la page derrière ne bougent pas.

- **Vue d'ensemble** : un tableau de bord qui occupe toute la page, sans charger la liste des participants :
  - chiffres clés en tuiles de couleur (à venir : sur la liste, invitations envoyées, réponses positives, refus, à inviter ; passé : invitations, présents, taux de présence, absents, entreprises) ;
  - carte **Informations** : date, heure, lieu, type, événement principal, informations ajoutées, description, et **Modifier l'événement** (formulaire complet avec photo recadrée) ;
  - à venir : **avancement** des invitations (barre de progression) et répartition Internes / Externes ; passé : répartition Internes / Externes et **entreprises les plus présentes** ;
  - **Prochaines étapes** : boutons de couleur (ajouter des invités, déposer l'invitation, enregistrer un envoi, préparer l'édition suivante…) ;
  - dernières actions, notes récentes (bouton *Toutes les notes*) et side events.
- **Participants** (événements passés) : la liste telle qu'elle vient de la master file, filtrable **Internes / Externes**, avec à côté les **notes** et les **documents** de l'événement.
- **Invités et suivi** (événements à venir), quatre blocs de couleur sur une même page :
  - **Invités** : la liste reste modifiable jusqu'au jour J. La fenêtre **Ajouter des invités** propose : *Une personne* (recherche), *Mes listes* (cocher **plusieurs listes** puis **Appliquer**), *Autres événements* (cocher **plusieurs événements**, choisir qui reprendre, puis **Appliquer**), *Fichier Excel* (un `.xlsx` ou `.csv` avec une colonne e-mail ; nom, prénom et société sont repris, et les personnes déjà connues sont rapprochées de leur fiche) et *Coller des e-mails*. Une personne présente plusieurs fois n'est ajoutée qu'une fois. On peut aussi ajouter depuis *Créer une liste* (bouton « Ajouter à un événement »). Chaque ajout et chaque retrait est daté et signé. Filtres : Internes / Externes, statut, **Mes envois**. Sélection multiple : marquer comme envoyé, copier les e-mails, retirer.
  - **Invitations** : dépôt par **glisser-déposer** des invitations déjà produites par votre outil (`.oft`, `.msg`, `.eml`, `.ics`) ou de tout autre document. Konex affiche un **aperçu** (objet, expéditeur, destinataires, contenu du mail ; date, lieu et participants d'un `.ics`), et le fichier se **télécharge** à tout moment.
  - **Suivi des envois** : qui a envoyé quoi, à qui et quand. Trois façons de l'alimenter :
    1. **Outlook (e-mail)** : *Marquer comme envoyé* sur une invitation. Les destinataires sont la sélection, les invités pas encore invités, tous les invités, ou ceux lus dans le fichier `.msg` / `.eml`.
    2. **Invitation Outlook (`.ics`)** : en déposant le `.ics`, Konex enregistre l'envoi et importe les réponses (accepté, refusé, peut-être).
    3. **Outil d'emailing ou d'inscription** : *Importer un suivi (Excel / CSV)*. Konex reconnaît les colonnes e-mail, statut et date (envoyé, ouvert, cliqué, inscrit, refusé, désinscrit, erreur d'envoi).

    Chaque invité affiche son statut : à inviter, invité le… par…, relancé le…, accepté, refusé…
  - **Notes** : les notes de l'équipe sur l'événement, et un champ pour en ajouter une.

Exports : **liste et suivi (Excel)**, **ajouter au calendrier (`.ics`)**, **invitation avec les invités (`.ics`)**.

Sur la fiche d'un contact, un encadré **À venir** indique les listes d'invités sur lesquelles il figure.

### Où sont rangés les fichiers
Les documents sont **chiffrés** (avec la clé d'équipe) et rangés dans le **dossier Konex** de la base partagée (`konex-fichiers/`). Si la base partagée n'est pas connectée, ils restent chiffrés sur ce poste, avec la mention « en attente du dossier Konex ». Ils y sont **déplacés automatiquement** dès que le dossier est connecté.

### Dans la master file
Deux onglets s'ajoutent à l'Excel master :
- **Événements à venir** : les événements créés dans Konex et validés ;
- **Listes d'invités** : les personnes sur chaque liste, avec qui les a ajoutées et quand.

Les **statuts d'invitation** (envoyé, relancé, accepté…) n'y figurent **pas** : ils restent dans Konex, car ils sont gérés dans Outlook.

---

## Fonctionnalités réservées à l'espace administrateur

### Contrôles qualité (menu de gauche, avec compteurs)
| Contrôle | Ce qu'il détecte |
|---|---|
| **Doublons de contacts** | Même personne présente sous plusieurs fiches. |
| **Inversions nom/prénom** | Système de points (nom = prénom courant, prénom en majuscules, e-mail commençant par le nom, usage croisé ailleurs…) ; signalé à partir de 2 points. |
| **Fautes de frappe** | Prénom ou nom proche d'une forme plus courante, problèmes de majuscules. |
| **Doublons d'entreprises** | Variantes d'un même nom de société (formes juridiques, ponctuation…). |
| **Doublons de CMO** | Un même CMO écrit de plusieurs façons. |
| **CMO et entités** | CMO à harmoniser, entité absente ou illisible (« ? », « - », « n/a » → non rattaché). |
| **Suggestions** | Propositions de correction issues des données. |
| **Champs incohérents** | E-mail dans le champ fonction, autre chose qu'une adresse dans le champ e-mail… |

### Journal des modifications
Il n'y a **plus d'étape de validation** : ce qu'un utilisateur modifie s'applique tout de suite pour toute l'équipe. Le journal liste chaque modification (fiche, champ, note, photo, archivage, événement, participant, signalement) avec **son auteur et sa date**, filtrable par auteur, fiche ou champ. L'administrateur peut **ouvrir la fiche** pour corriger, ou **annuler** une modification au cas par cas ; l'annulation s'applique à toute l'équipe à la publication suivante.

### Sauvegarder / Restaurer
Export de tout le travail dans **un fichier chiffré** avec le mot de passe en cours, et restauration ultérieure. Un rappel apparaît si aucune sauvegarde récente n'existe.

---

## Construction de la master file (Importer et contrôler)

Module de l'espace administrateur (anciennement *MarCom Master Builder*). Il transforme des dizaines de fichiers hétérogènes (toutes années, colonnes différentes) en **une master file propre**.

### Les 6 étapes

1. **Fichiers sources** — Déposez tous les fichiers (plusieurs à la fois). Un fichier portant le même nom qu'un fichier existant le remplace en conservant les réglages. Feuilles masquées détectées, feuilles ignorables.
   *Référentiel entreprises & CMO* : le fichier RMPM (colonnes « Business Group Name », « RMPM Code », « Pilot CMO »…) est reconnu automatiquement et enrichit chaque entreprise.
2. **Correspondance des colonnes** — L'outil reconnaît automatiquement les colonnes (FR, NL, EN, DE : *prénom, voornaam, first name…*) et **mémorise vos choix** pour les fichiers suivants. Champs : Prénom, Nom, Nom complet, E-mail, Société, Fonction, Présence/statut, CMO, Sous-événement (une colonne = un *side event* : une case remplie vaut « présent » à ce side event, sauf si la valeur est un statut reconnu comme « Inscrit » ; une valeur inconnue reste signalée dans les contrôles), Nom/Date/Lieu de l'événement, plus des **champs personnalisés** (par client ou par événement).
3. **Événements** — Événements détectés, codes, dates, lieux ; exclusion ou fusion possibles.
4. **Statuts de présence** — Statuts configurables avec alias multilingues et couleurs :

   | Statut | Étape |
   |---|---|
   | Présent | Jour J (présence) |
   | Absent (inscrit non venu) | Jour J |
   | Inscrit | Réponse à l'invitation |
   | Refusé | Réponse à l'invitation |
   | Invité (sans réponse) | Invitation |
   | Non invité | — |

5. **Contrôles** — Feuilles à vérifier, valeurs de présence inconnues, e-mails invalides, nom/prénom inversés, même e-mail avec noms différents, doublons probables, entreprises à harmoniser, statuts contradictoires, événements à vérifier, rapprochements et écarts avec le référentiel, entreprises absentes du référentiel, CMO à associer, fiches incomplètes, lignes non reprises. Décision **au cas par cas ou en lot** ; toutes les décisions sont consignées dans le **Journal**.
6. **Master file & export** — Aperçu filtrable, puis :
   - **Envoyer dans Konex** : alimente directement la recherche, les listes et les statistiques ;
   - **Excel (.xlsx)** — recommandé : une ligne par client, un bloc de colonnes par événement, couleurs par statut, listes déroulantes, filtres, volets figés, onglets Événements / Statuts / Contrôles / Journal / Sources ;
   - **CSV** (séparateur `;`, compatible Excel FR) ;
   - **CSV « une ligne par participation »** ;
   - **JSON** structuré (clients, événements, statuts, historique des sources) ;
   - **Rapport HTML** imprimable (Ctrl+P → PDF).

### Outils du module
- **Corriger les noms** (casse harmonisée : « DUPONT » → « Dupont », « jean-marc » → « Jean-Marc » ; les noms déjà en casse mixte ne sont jamais modifiés ; particules *de, van, von…* respectées ; civilités retirées).
- **CMO** : noms harmonisés, fusions, entités.
- **Journal des décisions** : chaque décision devient une règle réappliquée aux imports suivants.
- **Sauvegarde & sécurité** : sauvegarde chiffrée, verrouillage auto, changement de mot de passe, note IT/compliance, effacement complet.

---

## Konex et « Importer et contrôler » en miroir

L'espace administrateur et le module de construction de la master file partagent les mêmes décisions, dans les deux sens :

| Décision | Prise dans Konex → reprise dans le module | Prise dans le module → reprise dans Konex |
|---|:---:|:---:|
| Fusion de fiches (personnes, entreprises, CMO) | ✅ | ✅ (via la master file) |
| « Personnes / entreprises / CMO différents » | ✅ | ✅ |
| Nom et prénom laissés tels quels (pas d'inversion) | ✅ | ✅ |
| Corrections de nom, prénom, société, fonction, e-mail | ✅ | ✅ (via la master file) |
| **Annulation** d'une de ces décisions | ✅ | ✅ |
| Saisies : téléphone, LinkedIn, **VIP**, **interne**, notes, champs ajoutés, fiches archivées, entreprises, événements, CMO (avec leurs champs ajoutés) | ✅ | ✅ (via la master file) |

- Le module est chargé **en arrière-plan** dès la connexion administrateur : une décision prise dans Konex lui parvient **tout de suite**.
- En **quittant** « Importer et contrôler », la master file est **renvoyée automatiquement** dans Konex si elle a changé (une fois le premier envoi fait et toutes les feuilles validées). Le bouton « Envoyer dans Konex » reste disponible.
- Les contrôles des deux outils sont complémentaires : le module vérifie les fichiers bruts (e-mails invalides, statuts inconnus, statuts contradictoires, événements, référentiel, lignes non reprises), Konex vérifie la base consolidée (doublons, inversions, fautes de frappe, champs incohérents, CMO). Une question tranchée d'un côté n'est plus reposée de l'autre.

## Filtrer les participants : fiches entreprises et pages événements

La même barre **Filtrer** existe dans l'onglet **Participants** de la page d'un événement (type de contact, fonction, statut, e-mail, CMO, région du CMO, entité, pays, référentiel… selon ce que contient la liste).


Le style s'inspire des Réglages de l'iPhone : des **interrupteurs** pour les choix oui / non (Présents seulement, Internes, Avec e-mail, affichés seulement s'ils changent quelque chose), un bouton **Filtres** (avec le nombre de filtres actifs) qui déplie une feuille où chaque critère est une ligne (icône de couleur, valeur choisie, chevron) ; un appui déplie ses valeurs, cochées d'un appui, avec le nombre de personnes. Les filtres actifs s'affichent en **pastilles vertes** à retirer d'un appui, avec « Tout effacer ».

Au-dessus des listes **Contacts** et **Inscriptions des collaborateurs**, la barre de filtres propose, avec les critères de « Créer une liste » : participation (déjà venu, jamais venu, jamais invité), type de contact, fonction, pays / ville / région (colonnes ajoutées), référentiel, CMO, région du CMO, entité, classement, e-mail, informations ajoutées ; et pour les inscriptions : année, événement, type d'événement, lieu, statut.
- **Seuls les critères utiles apparaissent** : il faut qu'au moins une personne de la liste ait une valeur, et qu'il y ait un vrai choix à faire. Si aucun client n'est classé Top 500, le filtre « Classement » n'apparaît pas.
- Un clic sur une pastille ouvre la liste des valeurs, avec **le nombre de personnes** pour chacune (compte tenu des autres filtres) ; on coche puis **Appliquer**. La pastille devient « Fonction : Directeur » avec une croix pour la retirer.
- Une ligne indique « 7 sur 12 inscriptions · Effacer les filtres ». Les cinq premiers critères sont visibles, les autres derrière « + autres filtres ».

## Archivage et changement d'entreprise

Dans « Gestion de la fiche » d'une personne, quatre motifs : **Départ de l'entreprise**, **Changement d'entreprise**, **Ne plus inviter**, **Autre**. Archiver retire la personne des listes et des recherches, sans rien effacer.

**Changement d'entreprise** n'archive pas : Konex demande la nouvelle entreprise (et, si besoin, la nouvelle fonction et le nouvel e-mail). La fiche, son historique et ses notes suivent la personne ; l'ancienne entreprise reste affichée sur la fiche (« Entreprises précédentes ») et une note datée est ajoutée.

## Base partagée et travail en équipe

Konex n'utilise **aucun serveur ni connexion internet**. Le partage passe par un **dossier réseau** fourni par l'IT, dans lequel tout est chiffré avec une **clé d'équipe**.

```
Dossier réseau (fourni par l'IT)
├── marcom-equipe.json        ← identifie le dossier comme base Konex
├── édition publiée (chiffrée) ← base de référence, publiée par un admin
└── un fichier par utilisateur (chiffré) ← ses compléments et signalements
```

**Fonctionnement**
1. Un administrateur **crée** le dossier partagé (une fois) et choisit la clé d'équipe (≥ 12 caractères), à transmettre **de vive voix**.
2. Les administrateurs **publient une édition** numérotée (n° 1, 2, 3…).
3. Les utilisateurs **rejoignent** la base avec la clé et leur nom ; une bannière signale chaque nouvelle édition à charger.
4. Les compléments de chaque utilisateur sont écrits dans **son propre fichier** : visibles par toute l'équipe à la synchronisation suivante.
5. Les modifications s'appliquent sans validation ; l'administrateur les retrouve dans le **journal des modifications** et peut en annuler au cas par cas. Elles entrent dans la master file à l'édition suivante.

En cas d'indisponibilité du réseau, les compléments sont **conservés localement** et envoyés plus tard. Si un autre admin a publié une édition plus récente, Konex demande confirmation avant de l'écraser.

---

## Sécurité et conformité

- **Un seul fichier HTML**, aucune bibliothèque externe, aucun serveur.
- **Politique de sécurité (CSP) intégrée** : `connect-src 'none'`, `default-src 'none'` — toute connexion réseau est **bloquée** par le navigateur ; pas de polices, médias, iframes externes ni envoi de formulaires. `referrer: no-referrer`.
- **Chiffrement** : AES-GCM 256 bits ; clé dérivée du mot de passe par **PBKDF2-SHA-256, 310 000 itérations** ; IV aléatoire à chaque écriture ; données compressées (gzip) avant chiffrement.
- **Stockage** : IndexedDB du navigateur, sur ce poste uniquement. La clé n'est **jamais** écrite sur le disque et n'est pas exportable.
- **Verrouillage automatique** de Konex après **20 minutes** d'inactivité : les données sont retirées de la mémoire (le module « Importer et contrôler » garde son propre réglage : 5, 10, 15, 30 ou 60 min). Bouton **Verrouiller** disponible à tout moment.
- **Comptes personnels** : connexion par identifiant et mot de passe, deux espaces (utilisateur / administrateur), fichier des comptes signé et sans mot de passe (voir [Comptes et connexion](#comptes-et-connexion)).
- **Mot de passe oublié** : un administrateur le réinitialise (mot de passe provisoire à changer à la connexion). Les données locales protégées par l'ancien mot de passe ne peuvent être reprises qu'avec celui-ci.
- **Sauvegardes et base partagée chiffrées**.
- ⚠️ Les **exports** (Excel, CSV, JSON, HTML, PNG) **ne sont pas chiffrés** : rangez-les selon les règles de l'entreprise.
- Une **note de sécurité pour l'IT / la compliance** peut être générée depuis *Sauvegarde & sécurité*.

---

## Formats de fichiers

| Usage | Formats acceptés / produits |
|---|---|
| Import (module master file) | `.xlsx`, `.xlsm`, `.xltx`, `.xltm`, `.xls` (Excel 97-2003 / BIFF8), `.ods`, `.csv`, `.tsv`, `.txt`, `.htm`/`.html` (exports « .xls » web), `.xml` (SpreadsheetML 2003). Le format est détecté **par le contenu**, pas par l'extension. |
| Import rapide (espace administrateur) | `.xlsx`, `.xlsm`, `.csv` ; notes au format `.json` ; modèle téléchargeable. |
| Sauvegarde / restauration | `.json` chiffré (`.mmb` pour le module master file). |
| Comptes | `konex-utilisateurs.json` (signé, sans mot de passe). |
| Exports | `.xlsx`, `.csv`, `.json`, `.html`, `.png`, copie presse-papiers (Teams, e-mail, Excel, PowerPoint). |

Lecture et écriture Excel/ZIP **natives** (aucune dépendance), via `CompressionStream` / `DecompressionStream`.

---

## Navigateurs compatibles

| Navigateur | Support |
|---|---|
| Microsoft Edge (récent) | ✅ Recommandé |
| Google Chrome (récent) | ✅ Recommandé |
| Firefox, Safari | ⚠️ Fonctionnement de base : fichier des comptes à choisir à chaque connexion ; **base partagée** indisponible (API d'accès aux dossiers `showDirectoryPicker` absente). |

Prérequis : IndexedDB, Web Crypto (`crypto.subtle`), `CompressionStream`. Si le navigateur ne les fournit pas, l'écran de verrouillage l'indique.

---

## Glossaire

| Terme | Définition |
|---|---|
| **CMO** | Collaborateur qui suit le client. |
| **Pilot CMO** | CMO principal de l'entreprise, d'après le référentiel. |
| **RMPM** | Code unique d'une entreprise dans le référentiel. |
| **Top 500 / Top 1000** | Classement des entreprises clientes du référentiel RMPM. |
| **Stratégique, Core 75, GSC, GNPC** | Autres classements du référentiel, visibles sur les fiches entreprises. |
| **Entité** | Rattachement organisationnel (ex. « CIB Nordics »), relevé dans les fichiers ou, à défaut, celui du CMO. |
| **Master file** | Fichier de référence consolidé : une ligne par client, toutes les participations. |
| **Édition** | Version numérotée de la base publiée par un administrateur pour l'équipe. |
| **Contribution** | Complément ou signalement envoyé par un utilisateur, en attente de revue. |

---

## FAQ et dépannage

**J'ai oublié mon mot de passe.**
Demandez à un administrateur de le réinitialiser (Administration › Utilisateurs). Vous recevez un mot de passe provisoire, à changer à la connexion.

**« Identifiant ou mot de passe incorrect » / « Trop d'essais ».**
Vérifiez l'identifiant (sans accent) et le mot de passe ; après 3 erreurs, attendez quelques secondes.

**« Ce compte n'a pas accès à l'espace administrateur ».**
Votre compte a le rôle *Utilisateur* : utilisez l'onglet *Espace utilisateur*.

**« Le fichier des comptes a été modifié en dehors de Konex ».**
La signature n'est plus valide (modification à la main, fichier abîmé). Restaurez la version précédente du fichier depuis les sauvegardes du réseau, ou recréez le fichier (supprimez-le puis *Créer le premier administrateur*) et recréez les comptes.

**Konex demande l'« ancien mot de passe de ce poste ».**
C'est la première connexion depuis une ancienne version (ou après une réinitialisation) : saisissez le mot de passe utilisé jusqu'ici sur ce poste.

**Le dossier Konex est inaccessible (réseau coupé).**
Konex utilise la dernière copie connue du fichier des comptes pour la connexion et le signale ; les modifications de comptes attendront le retour du réseau.

**« Ce dossier n'est pas un dossier Konex ».**
Le fichier `marcom-equipe.json` est absent ou illisible : vérifiez que vous avez choisi le bon dossier réseau.

**« Clé d'équipe incorrecte ».**
Redemandez la clé à un administrateur.

**« La base partagée doit être reconnectée ».**
Le navigateur a perdu l'autorisation d'accès au dossier : cliquez sur *Se reconnecter*.

**« Impossible d'écrire dans le dossier partagé ».**
Vérifiez la connexion au réseau de l'entreprise ; vos compléments sont gardés et seront envoyés plus tard.

**Mes données ont disparu.**
Elles sont stockées dans le navigateur : un nettoyage des données de navigation les efface. Restaurez la dernière sauvegarde chiffrée ou rechargez l'édition partagée.

**Un ancien fichier `.xls` n'est pas lu.**
Enregistrez-le en `.xlsx` depuis Excel puis réimportez-le.

**Puis-je utiliser l'espace utilisateur et l'espace administrateur sur le même poste ?**
Oui : chaque espace a son propre stockage chiffré. Un administrateur peut se connecter dans les deux.

---

## Échanges avec d'autres outils (CRM, Outlook…)

Konex est prêt à être branché un jour à d'autres outils :
- **Format d'échange `konex-echange` (JSON, version 1)** : personnes, entreprises, événements, participations, événements à venir et leurs invités, avec des **identifiants stables**. Comme la master file, il ne contient jamais les statuts d'invitation. Un administrateur l'exporte depuis **Base partagée → Échange avec d'autres outils** (sur Domino, une copie est rangée dans `exports/`).
- **Registre de connecteurs** (`KX_CONNECTORS` dans `Konex.html`) : brancher un nouvel outil revient à ajouter un connecteur qui lit ou produit ce format, sans toucher au reste de l'outil.
- Sur Domino, le serveur (`konex_server.py`) range déjà les fichiers dans des dossiers clairs (`master/`, `exports/`) : un outil externe pourra y déposer ou y lire des fichiers.

## Tests

Le dossier `tests/` contient le test d'Arno : `node tests/arno-test.js` pose les questions de `tests/arno-corpus.js` (84 questions) et affiche le taux de bonnes réponses ; `C=./arno-corpus-2.js node tests/arno-test.js` pose 30 formulations différentes. Il faut Playwright et Chromium. À enrichir avec les questions réelles des utilisateurs (voir « Questions sans réponse » dans le profil d'Arno).

## Architecture technique

Application monopage en HTML/CSS/JavaScript vanilla, sans build ni dépendance.

```
Konex.html
├── <style>                  thème (vert MarCom), mise en page, composants
├── <body>                   menu latéral, recherche, grille, tiroir de fiche, modales, écran de verrouillage
├── <script id="mmbSrc">     module « Construction de la master file », chargé dans un iframe (srcdoc)
│                            et relié à Konex via window.MARCOM_HOST
└── <script>                 moteur Konex
    ├── Traductions (FR / EN)
    ├── Chiffrement & stockage (Web Crypto + IndexedDB)
    ├── Lecture/écriture ZIP, XLSX, XLS (OLE/BIFF8), ODS, CSV, HTML, SpreadsheetML
    ├── Recherche, fiches, listes, questions en langage naturel
    ├── Contrôles qualité (doublons, inversions, fautes, CMO, champs incohérents)
    ├── Statistiques (graphiques SVG, exports)
    ├── Base partagée (File System Access API) et contributions
    ├── Rôle appliqué à la connexion (applyRole) : fonctions d'administration neutralisées dans l'espace utilisateur
    └── Connexion, comptes (konex-utilisateurs.json), verrouillage, didacticiel, aide
```

Il n'y a plus de version « standard » compilée à part : le rôle est choisi à la connexion. Dans l'espace utilisateur, `applyRole(false)` remplace les fonctions réservées aux administrateurs par des fonctions vides, exactement comme le faisait l'ancien fichier standard.

**Performances** (base de test : 6 000 contacts, 29 000 participations) :
- au repos, Konex ne consomme pratiquement rien (aucune tâche de fond, aucune animation en boucle) ;
- une modification (note, VIP, correction…) coûte environ 1,6 s de calcul au lieu de 3,8 s :
  - les enregistrements rapprochés sont regroupés en un seul chiffrement de la base ;
  - les lignes importées, qui ne changent qu'à l'import, ne sont converties qu'une fois ;
  - le base64 utilise les fonctions natives du navigateur ;
- le module « Importer et contrôler », chargé en arrière-plan pour l'espace administrateur, ne recalcule et ne se redessine que lorsqu'on l'ouvre ou qu'une synchronisation en a besoin ;
- la recherche de doublons s'arrête dès que deux noms diffèrent de plus de 2 lettres ;
- le format des données enregistrées dans le navigateur ne change pas.

Limite connue : tout est enregistré et chiffré dans le navigateur, et la base entière est réécrite à chaque modification. Pour de très gros volumes, une vraie base de données côté serveur serait plus adaptée.

**Menu de gauche** : fixé à l'écran sur ordinateur, il défile indépendamment de la page, sans l'entraîner arrivé en bas, avec une barre de défilement visible.

**Modifier l'outil** : éditez le fichier HTML dans un éditeur de texte, puis rouvrez-le dans le navigateur. Les données déjà enregistrées sont conservées (même nom de base IndexedDB). Testez toujours d'abord avec les données d'exemple.

---

## Historique des versions

| Version | Fichiers | Statut / nouveautés |
|---|---|---|
| **Konex 3** | `Konex.html` | ✅ Version actuelle — préparation des événements à venir (création, page événement, invités, invitations `.oft`/`.msg`/`.eml`/`.ics`, suivi des envois), onglet Événements en premier, filtre Internes / Externes ; un seul fichier, deux espaces de connexion (utilisateur / administrateur) avec un mot de passe par espace, changement de mot de passe, traductions anglaises complétées ; filtres à choix multiples, création de liste simplifiée, Konex et « Importer et contrôler » en miroir, side events corrigés, VIP / interne rétablis ; comptes personnels `konex-utilisateurs.json` prêts mais désactivés jusqu'à la mise en ligne |
| Konex 2 | `old/Konex-2.html`, `old/Konex_admin-2.html` | Archivée — onglet RMPM, champ VIP, statuts détaillés et taux de présence sur les fiches, copie de l'historique, filtres de listes par statut et présences minimum |
| Konex 1 | `old/Konex.html`, `old/Konex_admin.html` | Archivée |
| MarCom CRM admin v5 | `old/MarCom_CRM_admin-5.html` | Archivée |
| MarCom CRM admin v4 | `old/MarCom_CRM_admin-4.html` | Archivée |
| MarCom CRM admin v3 | `old/MarCom_CRM_admin-3.html` | Archivée |
| MarCom CRM standard v4 | `old/MarCom_CRM_standard-4.html` | Archivée |
| MarCom CRM standard v3 | `old/MarCom_CRM_standard-3.html` | Archivée |

---

*Konex — by MarCom. Une question ? Contactez l'équipe MarCom.*

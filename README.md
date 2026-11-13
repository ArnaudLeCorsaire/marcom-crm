# Konex — by MarCom

**Konex** est l'outil de gestion des contacts et des événements de l'équipe MarCom : recherche de personnes, d'entreprises, de CMO et d'événements, construction de listes d'invités, statistiques de participation et contrôle qualité des données.

Il tient entièrement dans **un seul fichier HTML**, fonctionne **100 % hors ligne**, sans serveur, sans installation et sans aucune bibliothèque externe. Les données sont **chiffrées** sur le poste de l'utilisateur.

---

## Sommaire

1. [Contenu du dépôt](#contenu-du-dépôt)
2. [Les deux éditions](#les-deux-éditions)
3. [Démarrage rapide](#démarrage-rapide)
4. [Fonctionnalités communes](#fonctionnalités-communes)
5. [Fonctionnalités réservées à l'édition Admin](#fonctionnalités-réservées-à-lédition-admin)
6. [Construction de la master file (Importer et contrôler)](#construction-de-la-master-file-importer-et-contrôler)
7. [Base partagée et travail en équipe](#base-partagée-et-travail-en-équipe)
8. [Sécurité et conformité](#sécurité-et-conformité)
9. [Formats de fichiers](#formats-de-fichiers)
10. [Navigateurs compatibles](#navigateurs-compatibles)
11. [Glossaire](#glossaire)
12. [FAQ et dépannage](#faq-et-dépannage)
13. [Architecture technique](#architecture-technique)
14. [Historique des versions](#historique-des-versions)

---

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `Konex.html` | **Édition standard** — pour les utilisateurs de l'équipe (recherche, fiches, listes, statistiques, compléments). |
| `Konex_admin.html` | **Édition Admin** — tout l'outil : import des fichiers, contrôles qualité, gestion des événements, publication de l'édition pour l'équipe. |
| `old/` | Anciennes versions archivées (`MarCom_CRM_admin-3/4/5.html`, `MarCom_CRM_standard-3/4.html`). Conservées pour mémoire, **ne plus les utiliser**. |
| `README.md` | Ce document. |

---

## Les deux éditions

Les deux fichiers partagent le même moteur ; seule l'édition change (`EDITION='standard'` ou `EDITION='admin'`).

| Capacité | Standard (`Konex.html`) | Admin (`Konex_admin.html`) |
|---|:---:|:---:|
| Rechercher (personnes, CMO, entreprises, événements) | ✅ | ✅ |
| Poser une question en langage naturel | ✅ | ✅ |
| Consulter et copier une fiche, préparer un e-mail | ✅ | ✅ |
| Construire et exporter des listes | ✅ | ✅ |
| Statistiques et tableau de bord | ✅ | ✅ |
| Compléter un client ou une entreprise, ajouter une note, créer un contact | ✅ (journalisé, partagé) | ✅ |
| Signaler une erreur ou un doublon | ✅ | — |
| Modifier un événement ou une participation | ❌ (lecture seule) | ✅ |
| Fusionner, supprimer ou archiver une fiche | ❌ (utiliser « Signaler ») | ✅ |
| Importer des données / construire la master file | ❌ | ✅ |
| Contrôles qualité (doublons, inversions, fautes…) | ❌ | ✅ |
| Revoir les contributions de l'équipe | ❌ | ✅ |
| Publier l'édition pour l'équipe | ❌ | ✅ |
| Sauvegarder / restaurer | ❌ | ✅ |

Les deux éditions utilisent des espaces de stockage distincts dans le navigateur (`marcom-searching-tool` pour l'admin, `marcom-crm-standard` pour le standard) : elles peuvent coexister sur un même poste.

---

## Démarrage rapide

### Utilisateur (édition standard)

1. Récupérez `Konex.html` et ouvrez-le dans **Microsoft Edge** ou **Google Chrome** (double-clic).
2. Au premier lancement, **choisissez un mot de passe** : il chiffre toutes les données de ce poste.
3. Suivez le **didacticiel** (≈ 3 min 30, 5 gestes essentiels sur des données fictives).
4. Allez dans **Données › Base partagée**, sélectionnez le dossier réseau fourni par l'IT et saisissez la **clé d'équipe** transmise par un administrateur, ainsi que votre prénom et nom.
5. Chargez la dernière **édition publiée** : vous travaillez sur les données à jour de l'équipe.

### Administrateur (édition Admin)

1. Ouvrez `Konex_admin.html` dans Edge ou Chrome et définissez votre mot de passe.
2. **Administration › Importer et contrôler** : déposez les fichiers Excel/CSV (listes d'invités, réponses, présences) et, si disponible, le référentiel RMPM.
3. Suivez les 6 étapes (voir [Construction de la master file](#construction-de-la-master-file-importer-et-contrôler)), puis **Envoyer dans Konex**.
4. Traitez les **Contrôles qualité** du menu de gauche.
5. **Base partagée** : créez le dossier partagé (une seule fois) avec une clé d'équipe d'au moins 12 caractères, puis **Publier l'édition pour l'équipe**.
6. Pensez à **Sauvegarder** régulièrement (fichier chiffré).

> 💡 Pas encore de fichier ? Le module d'import propose des **données d'exemple « pleines de pièges »** pour tester l'outil.

---

## Fonctionnalités communes

### Rechercher
- Quatre onglets : **Personnes**, **CMO**, **Entreprises**, **Événements**.
- Recherche instantanée par nom, société ou e-mail ; insensible aux accents et à la casse.
- **Filtres** rapides (Top 500, classements, entités…) et **Plus de filtres** pour les critères moins courants.
- **Filtre par année** et **tri** configurable (dernier import, dernière venue, plus de présences, plus de contacts, plus de clients…).
- Cliquez sur une carte pour ouvrir la **fiche détaillée**.

### Poser une question
Tapez une question en français dans la barre de recherche puis Entrée, par exemple :
- « Top 500 en Belgique jamais venus »
- « Qui de Lambert Capital était présent en 2025 ? »

Konex interprète classement, pays, entreprise, année et statut de présence, et affiche le résultat.

### Fiches
- **Fiche personne** : identité, photo, coordonnées, bloc *Entreprise (employeur)*, CMO, historique des participations (replié, cliquez pour déplier), notes.
- **Fiche entreprise** : code RMPM, classements (Top 1000/500, Strategic, Core 75, GSC, GNPC), secteur, géographie, Pilot CMO, logo, contacts.
- **Fiche CMO** et **fiche événement** (avec filtre par entreprise et filtres présents/absents).
- Actions en tête de fiche :
  - **Copier la fiche** — à coller dans Teams ou un e-mail ;
  - **E-mail** — message prêt avec l'historique, éditable avant copie (version mise en forme ou texte brut) ;
  - **Compléter** — ajouter un téléphone, un LinkedIn, une fonction, une information prévue par les administrateurs.
- Photos et logos : **glisser-déposer** d'une image puis **recadrage** (glisser pour positionner, curseur ou molette pour zoomer).
- Garde-fous de saisie : téléphone, LinkedIn (`linkedin.com/in/…`), site web, entreprise et secteur choisis dans une liste, détection des fiches proches avant création.
- Chaque modification est **signée** et peut être **annulée** juste après.

### Construire une liste
- Combinez des critères : événement(s), statut (tous les invités, présents, inscrits, absents, statut précis, jamais conviés), classement, entreprise, CMO, entité, pays, année…
- **Copier les e-mails** en un clic, ou **exporter en Excel** (.xlsx).
- Les listes peuvent être enregistrées (conservées même lors du chargement d'une nouvelle édition).

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
Interface bilingue **français / anglais** (sélecteur FR | EN en bas du menu).

---

## Fonctionnalités réservées à l'édition Admin

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

### Contributions de l'équipe
Liste de ce que les utilisateurs ont complété ou signalé (nouveau contact, photo, note, champ modifié, signalement), filtrable par auteur, fiche ou champ. Chaque contribution peut être **ouverte**, **marquée traitée** ou **annulée** ; l'annulation s'applique à toute l'équipe à la publication suivante.

### Sauvegarder / Restaurer
Export de tout le travail dans **un fichier chiffré** avec le mot de passe en cours, et restauration ultérieure. Un rappel apparaît si aucune sauvegarde récente n'existe.

---

## Construction de la master file (Importer et contrôler)

Module intégré à l'édition Admin (anciennement *MarCom Master Builder*). Il transforme des dizaines de fichiers hétérogènes (toutes années, colonnes différentes) en **une master file propre**.

### Les 6 étapes

1. **Fichiers sources** — Déposez tous les fichiers (plusieurs à la fois). Un fichier portant le même nom qu'un fichier existant le remplace en conservant les réglages. Feuilles masquées détectées, feuilles ignorables.
   *Référentiel entreprises & CMO* : le fichier RMPM (colonnes « Business Group Name », « RMPM Code », « Pilot CMO »…) est reconnu automatiquement et enrichit chaque entreprise.
2. **Correspondance des colonnes** — L'outil reconnaît automatiquement les colonnes (FR, NL, EN, DE : *prénom, voornaam, first name…*) et **mémorise vos choix** pour les fichiers suivants. Champs : Prénom, Nom, Nom complet, E-mail, Société, Fonction, Présence/statut, CMO, Sous-événement (une colonne = un événement), Nom/Date/Lieu de l'événement, plus des **champs personnalisés** (par client ou par événement).
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
5. Un administrateur **revoit** les contributions ; elles entrent dans la master file à l'édition suivante.

En cas d'indisponibilité du réseau, les compléments sont **conservés localement** et envoyés plus tard. Si un autre admin a publié une édition plus récente, Konex demande confirmation avant de l'écraser.

---

## Sécurité et conformité

- **Un seul fichier HTML**, aucune bibliothèque externe, aucun serveur.
- **Politique de sécurité (CSP) intégrée** : `connect-src 'none'`, `default-src 'none'` — toute connexion réseau est **bloquée** par le navigateur ; pas de polices, médias, iframes externes ni envoi de formulaires. `referrer: no-referrer`.
- **Chiffrement** : AES-GCM 256 bits ; clé dérivée du mot de passe par **PBKDF2-SHA-256, 310 000 itérations** ; IV aléatoire à chaque écriture ; données compressées (gzip) avant chiffrement.
- **Stockage** : IndexedDB du navigateur, sur ce poste uniquement. La clé n'est **jamais** écrite sur le disque et n'est pas exportable.
- **Verrouillage automatique** après inactivité (5, 10 [défaut], 15, 30 ou 60 min) : les données sont retirées de la mémoire. Bouton **Verrouiller** disponible à tout moment.
- **Mot de passe non récupérable** : personne ne peut le réinitialiser. En cas d'oubli, seule l'option « Tout effacer et recommencer » est possible (d'où l'importance des sauvegardes).
- **Sauvegardes et base partagée chiffrées**.
- ⚠️ Les **exports** (Excel, CSV, JSON, HTML, PNG) **ne sont pas chiffrés** : rangez-les selon les règles de l'entreprise.
- Une **note de sécurité pour l'IT / la compliance** peut être générée depuis *Sauvegarde & sécurité*.

---

## Formats de fichiers

| Usage | Formats acceptés / produits |
|---|---|
| Import (module master file) | `.xlsx`, `.xlsm`, `.xltx`, `.xltm`, `.xls` (Excel 97-2003 / BIFF8), `.ods`, `.csv`, `.tsv`, `.txt`, `.htm`/`.html` (exports « .xls » web), `.xml` (SpreadsheetML 2003). Le format est détecté **par le contenu**, pas par l'extension. |
| Import rapide (édition Admin) | `.xlsx`, `.xlsm`, `.csv` ; notes au format `.json` ; modèle téléchargeable. |
| Sauvegarde / restauration | `.json` chiffré (`.mmb` pour le module master file). |
| Exports | `.xlsx`, `.csv`, `.json`, `.html`, `.png`, copie presse-papiers (Teams, e-mail, Excel, PowerPoint). |

Lecture et écriture Excel/ZIP **natives** (aucune dépendance), via `CompressionStream` / `DecompressionStream`.

---

## Navigateurs compatibles

| Navigateur | Support |
|---|---|
| Microsoft Edge (récent) | ✅ Recommandé |
| Google Chrome (récent) | ✅ Recommandé |
| Firefox, Safari | ⚠️ Fonctionnement de base ; la **base partagée** n'est pas disponible (API d'accès aux dossiers `showDirectoryPicker` absente). |

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
Il ne peut pas être récupéré. Utilisez « Mot de passe oublié ? Tout effacer et recommencer », puis restaurez une sauvegarde (admin) ou reconnectez la base partagée (standard).

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

**Puis-je utiliser Konex et Konex Admin sur le même poste ?**
Oui : chaque édition a son propre espace de stockage chiffré.

---

## Architecture technique

Application monopage en HTML/CSS/JavaScript vanilla, sans build ni dépendance.

```
Konex_admin.html
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
    └── Verrouillage, didacticiel, aide
```

`Konex.html` est la même application compilée en édition standard (`EDITION='standard'`), sans le module de construction de la master file.

**Modifier l'outil** : éditez le fichier HTML dans un éditeur de texte, puis rouvrez-le dans le navigateur. Les données déjà enregistrées sont conservées (même nom de base IndexedDB). Testez toujours d'abord avec les données d'exemple.

---

## Historique des versions

| Version | Fichiers | Statut |
|---|---|---|
| **Konex** | `Konex.html`, `Konex_admin.html` | ✅ Version actuelle |
| MarCom CRM admin v5 | `old/MarCom_CRM_admin-5.html` | Archivée |
| MarCom CRM admin v4 | `old/MarCom_CRM_admin-4.html` | Archivée |
| MarCom CRM admin v3 | `old/MarCom_CRM_admin-3.html` | Archivée |
| MarCom CRM standard v4 | `old/MarCom_CRM_standard-4.html` | Archivée |
| MarCom CRM standard v3 | `old/MarCom_CRM_standard-3.html` | Archivée |

---

*Konex — by MarCom. Une question ? Contactez l'équipe MarCom.*

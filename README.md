# Konex — by MarCom

**Konex** est l'outil de gestion des contacts et des événements de l'équipe MarCom : recherche de personnes, d'entreprises, de CMO et d'événements, construction de listes d'invités, statistiques de participation et contrôle qualité des données.

Il tient entièrement dans **un seul fichier HTML** (`Konex.html`), fonctionne **100 % hors ligne**, sans serveur, sans installation et sans aucune bibliothèque externe. À l'ouverture, on choisit l'**espace utilisateur** ou l'**espace administrateur** et on saisit le mot de passe ; les données sont **chiffrées** sur le poste.

> 🔑 **Mode actuel : deux mots de passe**, un pour l'espace utilisateur et un pour l'espace administrateur, **vérifiés dans le fichier `konex-mots-de-passe.json`** à la racine du dossier Konex. Ce fichier ne contient que leurs **empreintes** (hash), jamais les mots de passe en clair. Les comptes personnels (fichier `konex-utilisateurs.json`) sont prêts dans le code mais **désactivés** (voir [Comptes et connexion](#comptes-et-connexion)).

---

## Sommaire

1. [Contenu du dépôt](#contenu-du-dépôt)
2. [Un fichier, deux espaces](#un-fichier-deux-espaces)
3. [Démarrage rapide](#démarrage-rapide)
4. [Comptes et connexion](#comptes-et-connexion)
5. [Fonctionnalités communes](#fonctionnalités-communes)
6. [Fonctionnalités réservées à l'espace administrateur](#fonctionnalités-réservées-à-lespace-administrateur)
7. [Construction de la master file (Importer et contrôler)](#construction-de-la-master-file-importer-et-contrôler)
8. [Base partagée et travail en équipe](#base-partagée-et-travail-en-équipe)
9. [Sécurité et conformité](#sécurité-et-conformité)
10. [Formats de fichiers](#formats-de-fichiers)
11. [Navigateurs compatibles](#navigateurs-compatibles)
12. [Glossaire](#glossaire)
13. [FAQ et dépannage](#faq-et-dépannage)
14. [Architecture technique](#architecture-technique)
15. [Historique des versions](#historique-des-versions)

---

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `Konex.html` | **L'outil**, pour tout le monde. À l'ouverture, deux fenêtres de connexion : **espace utilisateur** et **espace administrateur**. |
| `konex-mots-de-passe.json` | Les **empreintes** (hash PBKDF2-SHA-256) du mot de passe administrateur et du mot de passe utilisateur, à placer à la racine du dossier Konex, à côté de `Konex.html`. Aucun mot de passe en clair. Voir [Comptes et connexion](#comptes-et-connexion). |
| `konex-utilisateurs.json` | *(mode comptes personnels, désactivé ; créé par Konex, pas dans ce dépôt)* Le fichier des comptes, à la racine du dossier Konex sur le réseau. |
| `old/` | Anciennes versions archivées (`Konex-2.html`, `Konex_admin-2.html`, `Konex.html` v1, `Konex_admin.html` v1, `MarCom_CRM_admin-3/4/5.html`, `MarCom_CRM_standard-3/4.html`). Conservées pour mémoire, **ne plus les utiliser**. |
| `README.md` | Ce document. |

---

## Un fichier, deux espaces

Les anciennes éditions standard et admin sont réunies dans **un seul fichier**, `Konex.html`. L'écran de connexion propose deux onglets :

- **Espace utilisateur** — s'ouvre avec le **mot de passe utilisateur**, commun à l'équipe (les administrateurs peuvent aussi l'utiliser pour voir l'outil comme l'équipe) ;
- **Espace administrateur** — s'ouvre avec le **mot de passe administrateur**, connu des seuls administrateurs.

L'espace choisi à la connexion décide de ce qui est disponible :

| Capacité | Espace utilisateur | Espace administrateur |
|---|:---:|:---:|
| Rechercher (personnes, CMO, entreprises, RMPM, événements) | ✅ | ✅ |
| Poser une question en langage naturel | ✅ | ✅ |
| Consulter et copier une fiche, préparer un e-mail | ✅ | ✅ |
| Construire et exporter des listes | ✅ | ✅ |
| Statistiques et tableau de bord | ✅ | ✅ |
| Compléter un client ou une entreprise, ajouter une note, créer un contact | ✅ (journalisé, partagé) | ✅ |
| Signaler une erreur ou un doublon | ✅ | — |
| Changer les mots de passe d'accès (menu **Mots de passe**) | ❌ | ✅ |
| Modifier un événement ou une participation | ❌ (lecture seule) | ✅ |
| Fusionner, supprimer ou archiver une fiche | ❌ (utiliser « Signaler ») | ✅ |
| Importer des données / construire la master file | ❌ | ✅ |
| Contrôles qualité (doublons, inversions, fautes…) | ❌ | ✅ |
| Revoir les contributions de l'équipe | ❌ | ✅ |
| Publier l'édition pour l'équipe | ❌ | ✅ |
| Gérer les comptes personnels (page **Utilisateurs**, mode comptes personnels seulement) | ❌ | ✅ |
| Sauvegarder / restaurer | ❌ | ✅ |

Chaque espace garde ses propres données sur le poste (`marcom-crm-standard` pour l'espace utilisateur, `marcom-searching-tool` pour l'espace administrateur, dans le stockage du navigateur). Les données déjà présentes des anciennes versions sont reprises automatiquement.

---

## Démarrage rapide

### Utilisateur

1. Ouvrez `Konex.html` dans **Microsoft Edge** ou **Google Chrome**.
2. La première fois sur ce poste, cliquez sur **Choisir le dossier Konex** et sélectionnez le dossier qui contient `Konex.html` et `konex-mots-de-passe.json` (le navigateur s'en souvient).
3. Onglet **Espace utilisateur** : saisissez le **mot de passe utilisateur** communiqué par un administrateur. Il chiffre aussi les données de cet espace sur le poste.
4. Suivez le **didacticiel** (≈ 3 min 30, 5 gestes essentiels sur des données fictives).
5. **Données › Base partagée** : connectez le dossier de l'équipe avec la **clé d'équipe** transmise par un administrateur, puis chargez la dernière **édition publiée**.

### Administrateur

1. Onglet **Espace administrateur** (même dossier Konex que ci-dessus) : saisissez le **mot de passe administrateur**. Si le poste a des données d'une version précédente, Konex demande une seule fois leur ancien mot de passe pour les reprendre.
2. **Administration › Importer et contrôler** : déposez les fichiers Excel/CSV (listes d'invités, réponses, présences) et, si disponible, le référentiel RMPM.
3. Suivez les 6 étapes (voir [Construction de la master file](#construction-de-la-master-file-importer-et-contrôler)), puis **Envoyer dans Konex**.
4. Traitez les **Contrôles qualité** du menu de gauche.
5. **Base partagée** : créez le dossier partagé (une seule fois) avec une clé d'équipe d'au moins 12 caractères, puis **Publier l'édition pour l'équipe**.
6. Pensez à **Sauvegarder** régulièrement (fichier chiffré).

> 💡 Pas encore de fichier ? Le module d'import propose des **données d'exemple « pleines de pièges »** pour tester l'outil.

---

## Comptes et connexion

Le mode de connexion se choisit sur une ligne de `Konex.html` : `const AUTH_MODE='json';` (mode actuel), `'local'` (ancien mode) ou `'accounts'` (comptes personnels).

### Mode actuel : deux mots de passe, vérifiés dans `konex-mots-de-passe.json`

Konex a **deux mots de passe** :

- le **mot de passe utilisateur**, commun à l'équipe, ouvre l'**espace utilisateur** ;
- le **mot de passe administrateur**, connu des seuls administrateurs, ouvre l'**espace administrateur**.

Ils sont vérifiés dans le fichier **`konex-mots-de-passe.json`**, à la **racine du dossier Konex** (à côté de `Konex.html`). Ce fichier ne contient **aucun mot de passe**, ni en clair ni chiffré de façon réversible : seulement leur **empreinte** (hash).

```json
{
  "format": "konex-mots-de-passe",
  "version": 1,
  "note": "…",
  "admin":       { "algorithm": "PBKDF2-SHA-256", "iterations": 600000, "salt": "…", "hash": "…", "updated": "…" },
  "utilisateur": { "algorithm": "PBKDF2-SHA-256", "iterations": 600000, "salt": "…", "hash": "…", "updated": "…" }
}
```

| Champ | Rôle |
|---|---|
| `admin`, `utilisateur` | Une entrée par espace. |
| `salt` | Sel aléatoire de 16 octets (base64), propre à chaque mot de passe et renouvelé à chaque changement : deux mots de passe identiques n'ont pas la même empreinte. |
| `iterations` | Nombre de tours de calcul (600 000) : chaque essai prend du temps, ce qui freine les tentatives en série. |
| `hash` | L'empreinte : PBKDF2-HMAC-SHA-256 du mot de passe (texte normalisé NFC, encodé en UTF-8), 32 octets en base64. Elle permet de **vérifier** un mot de passe, pas de le **retrouver**. |
| `updated` | Date du dernier changement. |

**À la connexion**, Konex lit le fichier, recalcule l'empreinte du mot de passe saisi avec le sel de l'espace choisi et la compare à celle du fichier. Si elles correspondent, le mot de passe **chiffre aussi les données de cet espace sur le poste** (AES-GCM 256, comme avant). Après 3 erreurs, il faut attendre quelques secondes avant un nouvel essai.

#### Première connexion sur un poste

Une page ouverte depuis un fichier ne peut pas lire seule un fichier voisin. Konex demande donc de **choisir le dossier Konex** une fois (bouton *Choisir le dossier Konex*) ; Edge et Chrome s'en souviennent, et peuvent redemander l'autorisation de lecture après un redémarrage. Sur Firefox et Safari, il faut choisir le fichier `konex-mots-de-passe.json` à chaque connexion.

#### Changer un mot de passe

Dans l'espace administrateur, menu **Mots de passe** : choisir l'espace, saisir le mot de passe administrateur actuel, puis le nouveau mot de passe (au moins 12 caractères, avec des lettres et des chiffres ; les deux mots de passe doivent être différents). Konex réécrit `konex-mots-de-passe.json` dans le dossier Konex (Edge ou Chrome, avec le droit de modifier le dossier).

- Nouveau mot de passe **administrateur** : les données administrateur de ce poste sont rechiffrées aussitôt.
- Nouveau mot de passe **utilisateur** : sur chaque poste, à la connexion suivante, Konex demande **une seule fois l'ancien** pour reprendre les données (ou propose de repartir de zéro sur ce poste).

Transmettez les nouveaux mots de passe de vive voix ou par un canal sûr.

#### Fichier absent ou mot de passe administrateur perdu

Si le dossier ne contient pas `konex-mots-de-passe.json`, l'onglet **Espace administrateur** propose de le **créer** en choisissant les deux mots de passe. En cas de mot de passe administrateur perdu : supprimer (ou renommer) le fichier dans le dossier Konex, puis le recréer ainsi. C'est pourquoi le droit de modifier le dossier doit être réservé aux administrateurs.

#### Données des versions précédentes

Les données enregistrées avec l'ancien mode (un mot de passe choisi sur chaque poste) ne sont pas perdues : à la première connexion, Konex demande **une seule fois l'ancien mot de passe du poste** et rechiffre les données avec le mot de passe du fichier. *Je ne m'en souviens pas : repartir de zéro sur ce poste* efface les données locales de cet espace ; celles de l'équipe se rechargent depuis la base partagée.

#### Limites

Konex fonctionne sans serveur : la vérification se fait dans le navigateur.

- **Seuls les administrateurs doivent pouvoir modifier le dossier Konex** (droits gérés par l'IT) : qui peut remplacer `konex-mots-de-passe.json` peut y mettre l'empreinte de son propre mot de passe. Il n'obtient pas pour autant les données déjà chiffrées sur les postes, ni la clé d'équipe de la base partagée.
- Quelqu'un qui modifie sa propre copie de `Konex.html` peut contourner l'écran de connexion **sur son poste**, comme dans tout outil sans serveur.
- Une empreinte ne se renverse pas, mais un mot de passe **court ou courant** peut être retrouvé en essayant des mots de passe un par un à partir du fichier : choisissez des mots de passe longs et aléatoires, surtout si le fichier est visible au-delà de l'équipe (par exemple dans un dépôt GitHub public).
- Le mot de passe est **commun** : Konex ne sait pas qui s'est connecté. Pour des comptes nominatifs, voir les comptes personnels ci-dessous.
- Si le dossier est inaccessible (réseau coupé), Konex utilise la **dernière copie connue** du fichier, gardée sur le poste, et le signale.

### Ancien mode : un mot de passe par poste

`const AUTH_MODE='local';` rétablit le fonctionnement précédent : chaque espace a son propre mot de passe, choisi sur chaque poste à la première ouverture, sans aucune vérification. ⚠️ Rien n'empêche alors quelqu'un d'ouvrir l'espace administrateur sur son poste en choisissant un mot de passe.

### À la mise en ligne : comptes personnels (prêts, désactivés)

Pour les activer, remplacer `const AUTH_MODE='json';` par `const AUTH_MODE='accounts';` dans `Konex.html`. Konex demande alors de choisir le dossier Konex sur le réseau, crée `konex-utilisateurs.json` à sa racine avec le premier administrateur, et ajoute la page **Administration › Utilisateurs**. Ce qui suit décrit ce mode.

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
- Cinq onglets : **Personnes**, **CMO**, **Entreprises**, **Événements** et **RMPM** (recherche par code RMPM : entreprises du référentiel et employés rattachés).
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

### Construire une liste
- Combinez des critères : événement(s), **statut à ces événements** (tous les invités, présents, inscrits, absents, statut précis, jamais conviés), **présences minimum**, classement, entreprise, CMO, entité, pays, année…
- En mode clients, avec 12 événements ou moins sélectionnés, une **colonne par événement** affiche le statut de chaque personne (également dans l'export).
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
Interface bilingue **français / anglais** : sélecteur FR | EN sur l'écran de connexion et en bas du menu. En anglais, les statuts de présence enregistrés en français dans les données (« Présent », « Refusé », « Sans réponse »…) sont traduits à l'affichage. Seul le module **Importer et contrôler** reste en français pour l'instant (un message le signale en anglais).

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

### Contributions de l'équipe
Liste de ce que les utilisateurs ont complété ou signalé (nouveau contact, photo, note, champ modifié, signalement), filtrable par auteur, fiche ou champ. Chaque contribution peut être **ouverte**, **marquée traitée** ou **annulée** ; l'annulation s'applique à toute l'équipe à la publication suivante.

### Sauvegarder / Restaurer
Export de tout le travail dans **un fichier chiffré** avec le mot de passe en cours, et restauration ultérieure. Un rappel apparaît si aucune sauvegarde récente n'existe.

---

## Construction de la master file (Importer et contrôler)

Module de l'espace administrateur (anciennement *MarCom Master Builder*). Il transforme des dizaines de fichiers hétérogènes (toutes années, colonnes différentes) en **une master file propre**.

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
- **Connexion** : deux mots de passe (utilisateur / administrateur) vérifiés dans `konex-mots-de-passe.json`, qui ne contient que leurs empreintes PBKDF2-SHA-256 (600 000 itérations, sel aléatoire propre à chaque mot de passe). Les comptes personnels signés sont prêts mais désactivés (voir [Comptes et connexion](#comptes-et-connexion)).
- **Mot de passe oublié** : le demander à un administrateur ; les administrateurs changent les mots de passe depuis le menu **Mots de passe**. Les données locales protégées par un ancien mot de passe ne peuvent être reprises qu'avec celui-ci.
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
| Mots de passe d'accès | `konex-mots-de-passe.json` (empreintes PBKDF2-SHA-256, aucun mot de passe en clair). |
| Comptes personnels (désactivés) | `konex-utilisateurs.json` (signé, sans mot de passe). |
| Exports | `.xlsx`, `.csv`, `.json`, `.html`, `.png`, copie presse-papiers (Teams, e-mail, Excel, PowerPoint). |

Lecture et écriture Excel/ZIP **natives** (aucune dépendance), via `CompressionStream` / `DecompressionStream`.

---

## Navigateurs compatibles

| Navigateur | Support |
|---|---|
| Microsoft Edge (récent) | ✅ Recommandé |
| Google Chrome (récent) | ✅ Recommandé |
| Firefox, Safari | ⚠️ Fonctionnement de base : fichier `konex-mots-de-passe.json` à choisir à chaque connexion, mots de passe impossibles à changer ; **base partagée** indisponible (API d'accès aux dossiers `showDirectoryPicker` absente). |

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

**J'ai oublié le mot de passe.**
Demandez-le à un administrateur. Les administrateurs le changent depuis le menu **Mots de passe** de l'espace administrateur.

**« Mot de passe incorrect » / « Trop d'essais ».**
Vérifiez l'onglet choisi (*Espace utilisateur* ou *Espace administrateur* : chacun a son mot de passe) et le mot de passe ; après 3 erreurs, attendez quelques secondes.

**« Ce dossier ne contient pas de fichier konex-mots-de-passe.json ».**
Le dossier choisi n'est pas le bon : cliquez sur *Changer* et choisissez le dossier qui contient `Konex.html` et `konex-mots-de-passe.json`. S'il n'existe vraiment pas, un administrateur le crée depuis l'onglet *Espace administrateur*.

**Konex demande l'« ancien mot de passe de ce poste ».**
C'est la première connexion depuis une ancienne version, ou le mot de passe a changé depuis : les données de ce poste sont encore chiffrées avec l'ancien. Saisissez-le une fois, elles sont rechiffrées avec le nouveau.

**Le dossier Konex est inaccessible (réseau coupé).**
Konex utilise la dernière copie connue du fichier des mots de passe (ou, en mode comptes personnels, du fichier des comptes) pour la connexion et le signale ; les changements attendront le retour du réseau.

*Les trois questions suivantes concernent le mode comptes personnels (désactivé).*

**« Identifiant ou mot de passe incorrect ».**
Vérifiez l'identifiant (sans accent) et le mot de passe ; après 3 erreurs, attendez quelques secondes.

**« Ce compte n'a pas accès à l'espace administrateur ».**
Votre compte a le rôle *Utilisateur* : utilisez l'onglet *Espace utilisateur*.

**« Le fichier des comptes a été modifié en dehors de Konex ».**
La signature n'est plus valide (modification à la main, fichier abîmé). Restaurez la version précédente du fichier depuis les sauvegardes du réseau, ou recréez le fichier (supprimez-le puis *Créer le premier administrateur*) et recréez les comptes.

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
    └── Connexion (AUTH_MODE : 'json' → konex-mots-de-passe.json, 'local', 'accounts' → konex-utilisateurs.json),
        verrouillage, didacticiel, aide
```

Il n'y a plus de version « standard » compilée à part : le rôle est choisi à la connexion. Dans l'espace utilisateur, `applyRole(false)` remplace les fonctions réservées aux administrateurs par des fonctions vides, exactement comme le faisait l'ancien fichier standard.

**Modifier l'outil** : éditez le fichier HTML dans un éditeur de texte, puis rouvrez-le dans le navigateur. Les données déjà enregistrées sont conservées (même nom de base IndexedDB). Testez toujours d'abord avec les données d'exemple.

---

## Historique des versions

| Version | Fichiers | Statut / nouveautés |
|---|---|---|
| **Konex 3** | `Konex.html`, `konex-mots-de-passe.json` | ✅ Version actuelle — un seul fichier, deux espaces de connexion (utilisateur / administrateur), mots de passe vérifiés dans `konex-mots-de-passe.json` (empreintes seulement) et modifiables par les administrateurs, traductions anglaises complétées ; comptes personnels `konex-utilisateurs.json` prêts mais désactivés jusqu'à la mise en ligne |
| Konex 2 | `old/Konex-2.html`, `old/Konex_admin-2.html` | Archivée — onglet RMPM, champ VIP, statuts détaillés et taux de présence sur les fiches, copie de l'historique, filtres de listes par statut et présences minimum |
| Konex 1 | `old/Konex.html`, `old/Konex_admin.html` | Archivée |
| MarCom CRM admin v5 | `old/MarCom_CRM_admin-5.html` | Archivée |
| MarCom CRM admin v4 | `old/MarCom_CRM_admin-4.html` | Archivée |
| MarCom CRM admin v3 | `old/MarCom_CRM_admin-3.html` | Archivée |
| MarCom CRM standard v4 | `old/MarCom_CRM_standard-4.html` | Archivée |
| MarCom CRM standard v3 | `old/MarCom_CRM_standard-3.html` | Archivée |

---

*Konex — by MarCom. Une question ? Contactez l'équipe MarCom.*

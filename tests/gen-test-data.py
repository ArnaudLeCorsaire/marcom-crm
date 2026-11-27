# Jeu de données fictif et réaliste pour tester Konex / Importer et contrôler (aucune donnée réelle)
import random, datetime, os, csv
from openpyxl import Workbook
random.seed(42)
OUT = os.path.dirname(os.path.abspath(__file__)) + '/test-data/files' + ('' if os.environ.get('SCALE','1')=='1' else os.environ['SCALE'])
os.makedirs(OUT, exist_ok=True)
SCALE = int(os.environ.get('SCALE', '1'))

FIRST = ['Jean','Marie','Pierre','Sophie','Luc','Anne','Thomas','Julie','Nicolas','Claire','Marc','Isabelle','Olivier','Nathalie','Pieter','Els','Jan','An','Koen','Sarah','Hélène','Éric','Céline','Benoît','Agnès','François','Zoé','Mathieu','Laurence','Didier','Inès','Bart','Wim','Katrien','Geert','Ann-Sophie','Jean-Marc','Marie-Claire','Frédéric','Joëlle']
LAST = ['Dupont','Martin','Bernard','Dubois','Peeters','Janssens','Maes','Jacobs','Mertens','Willems','Claes','Goossens','Wouters','De Smet','Lambert','Leroy','Van den Berghe','Vermeulen','Dumont','Lemaire','Renard','Fontaine','Simon','Laurent','Girard','Mercier','Van Damme','De Backer','Hermans','Michel']
SECT = ['Industrie','Énergie','Pharma','Transport','Distribution','Immobilier','Télécom','Agroalimentaire','Chimie','Services financiers']
CTRY = ['Belgium','France','Netherlands','Luxembourg','Germany']
CMOS = ['DUPUIS Laurent','Claire Vandamme','Marc ROSSI','Sophie Leclercq','Pieter De Wit','Anne-Sophie Moreau','Karim Benali','Julie Hendrickx','Tom Verhaegen','Isabelle Noël','Olivier Gérard','Nadia El Amrani']
ENTS = {'DUPUIS Laurent':'CIB Belgium','Claire Vandamme':'CIB Belgium','Marc ROSSI':'CIB France','Sophie Leclercq':'CIB France','Pieter De Wit':'CIB Netherlands','Anne-Sophie Moreau':'CIB Luxembourg',
        'Karim Benali':'CIB Belgium','Julie Hendrickx':'CIB Netherlands','Tom Verhaegen':'CIB Belgium','Isabelle Noël':'CIB France','Olivier Gérard':'CIB Luxembourg','Nadia El Amrani':'CIB Belgium'}
LEG = ['SA','NV','SRL','BV','Group','SAS','']

def strip(s):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower()

# --- entreprises et référentiel ---
NCO = 120 * SCALE
cos = []
for i in range(NCO):
    base = random.choice(['Acme','Norvia','Fintra','Telvio','Kestrel','Orbis','Pharmalis','Assuria','Marchex','Lambert','Solvex','Bruxa','Delta','Nordlicht','Atlas','Vega','Helix','Quanta','Sirius','Vertex'])
    name = f"{base} {random.choice(['Holding','Industries','Logistics','Energy','Capital','Services','Systems','Partners','International','Europe'])}" + (f" {i}" if i >= 20 else '')
    cos.append({'name': name, 'leg': random.choice(LEG), 'rmpm': str(100000 + i * 7), 'cmo': random.choice(CMOS), 'sector': random.choice(SECT),
                'ctry': random.choice(CTRY), 'top': random.choice(['Top 500', 'Top 1000', '', '']), 'core': random.random() < .15, 'strat': random.random() < .1})
wb = Workbook(); ws = wb.active; ws.title = 'RMPM'
ws.append(['Extraction référentiel RMPM – usage interne']); ws.append([])
ws.append(['Business Group Name','RMPM Code','Top 1000/500','Strategic Client (CIB EMEA)','Core 75','GSC','GNPC','Cash Management Sector','RMPM Client Coverage','Coverage Pilot Country','CM Pilot Country','Pilot CMO','Regional Cash Mgt Sales in Europe','RCMS','RCMS – pôle européen en charge'])
for c in cos[:int(NCO * .85)]:  # 15 % des entreprises hors référentiel
    ws.append([(c['name'] + ' ' + c['leg']).strip().upper() if random.random() < .3 else (c['name'] + ' ' + c['leg']).strip(), int(c['rmpm']), c['top'], 'Strategic' if c['strat'] else '', 'Core 75' if c['core'] else '', 'N/A', '', c['sector'],
               'Coverage CIB', c['ctry'], c['ctry'], c['cmo'] + (' / ' + random.choice(CMOS) if random.random() < .08 else ''), random.choice(['Luc Hermans', 'Ann Peeters', '']), 'RCMS', random.choice(['Brussels', 'Paris', 'Amsterdam'])])
wb.save(f'{OUT}/Referentiel_RMPM_2026.xlsx')

# --- personnes ---
NP = 900 * SCALE
people = []
for i in range(NP):
    fn, ln = random.choice(FIRST), random.choice(LAST)
    co = random.choice(cos)
    dom = strip(co['name'].split()[0]) + ('.be' if random.random() < .6 else '.com')
    em = f"{strip(fn).replace(' ','')}.{strip(ln).replace(' ','')}{i}@{dom}"
    people.append({'fn': fn, 'ln': ln, 'co': co, 'em': em, 'job': random.choice(['CFO','Treasurer','Directeur financier','Head of Treasury','CEO','Trésorier','Financial Controller','Directrice générale','Comptable','Analyste']), 'int': False})
# collaborateurs BNP Paribas (internes)
for i in range(40 * SCALE):
    fn, ln = random.choice(FIRST), random.choice(LAST)
    people.append({'fn': fn, 'ln': ln, 'co': {'name': 'BNP Paribas Fortis', 'leg': '', 'cmo': ''}, 'em': f"{strip(fn)}.{strip(ln)}{i}@bnpparibasfortis.com", 'job': 'Relationship Manager', 'int': True})

def variant(p, k):
    """renvoie une version « sale » de la personne, comme dans les vrais fichiers"""
    fn, ln, em, co = p['fn'], p['ln'], p['em'], p['co']['name']
    r = random.random()
    if k == 'case' and r < .5: ln = ln.upper()
    if k == 'swap' and r < .05: fn, ln = ln.upper(), fn
    if r < .04: em = em.upper()
    if r < .03: em = ''  # e-mail manquant
    if r < .02: em = em.replace('@', ' @')  # e-mail invalide
    if random.random() < .25: co = co + ' ' + p['co'].get('leg', '')
    if random.random() < .05 and len(co) > 6: co = co[:-1]  # faute de frappe
    return fn.strip(), ln.strip(), em, co.strip()

STAT_SETS = [['Présent', 'Absent', 'Inscrit', 'Refusé', 'Invité'], ['Attended', 'No show', 'Registered', 'Declined', 'Invited'], ['présent', 'absente', 'confirmé', 'excusé', 'sans réponse'], ['Oui', 'Non', 'Peut-être', '', 'x']]
EVENTS = []
d0 = datetime.date(2023, 1, 15)
names = ['Forum Clients', 'Petit-déjeuner Leasing', 'Gala annuel', 'Conférence Perspectives économiques', 'Matinale Fintech', 'Afterwork clients', 'Webinaire ESG', 'Dîner partenaires', 'Séminaire Trésorerie', 'Golf Cup']
for y in (2023, 2024, 2025, 2026):
    for n in names:
        if random.random() < .65:
            EVENTS.append({'name': f"{n} {y}" if random.random() < .5 else n, 'date': datetime.date(y, random.randint(1, 11), random.randint(1, 28)), 'lieu': random.choice(['Bruxelles', 'Anvers', 'Gand', 'Liège', 'Namur', 'Luxembourg', 'Paris'])})
fid = 0
for ev in EVENTS:
    fid += 1
    guests = random.sample(people, random.randint(25, 140) * SCALE if SCALE > 1 else random.randint(25, 140))
    style = fid % 6
    stset = STAT_SETS[fid % len(STAT_SETS)]
    rows = []
    for p in guests:
        fn, ln, em, co = variant(p, 'case' if style == 2 else 'swap')
        w = random.random()
        st = stset[0] if w < .5 else stset[1] if w < .62 else stset[2] if w < .75 else stset[3] if w < .87 else stset[4]
        cmo = p['co'].get('cmo') or ''
        if cmo and random.random() < .2: cmo = random.choice(CMOS)  # CMO différent du référentiel
        if cmo and random.random() < .2: cmo = cmo.lower()
        rows.append((fn, ln, em, co, p['job'], st, cmo))
    # doublons dans le même fichier
    for _ in range(3): rows.append(random.choice(rows))
    fname = f"{fid:02d} {ev['name']} - {ev['date'].isoformat()}"
    if style == 5:  # CSV point-virgule, windows-1252
        with open(f'{OUT}/{fname}.csv', 'w', newline='', encoding='cp1252', errors='replace') as fh:
            wr = csv.writer(fh, delimiter=';'); wr.writerow(['Nom complet', 'E-mail', 'Société', 'Fonction', 'Statut', 'Chargé de relation'])
            for r in rows: wr.writerow([f"{r[0]} {r[1]}", r[2], r[3], r[4], r[5], r[6]])
        continue
    wb = Workbook(); ws = wb.active
    if style == 0:
        ws.title = 'Participants'; ws.append(['Prénom', 'Nom', 'E-mail', 'Société', 'Fonction', 'Présence', 'CMO'])
        for r in rows: ws.append(list(r))
    elif style == 1:
        ws.title = 'Export'; ws.append([f"Liste des invités – {ev['name']}"]); ws.append([f"Date : {ev['date'].strftime('%d/%m/%Y')}"]); ws.append([])
        ws.append(['First name', 'Last name', 'Email address', 'Company', 'Job title', 'Status', 'Relationship Manager'])
        for r in rows: ws.append(list(r))
    elif style == 2:
        ws.title = 'Feuil1'; ws.append(['NOM', 'PRENOM', 'SOCIETE', 'MAIL', 'STATUT', 'EVENEMENT', 'DATE', 'LIEU', 'CMO'])
        for r in rows: ws.append([r[1], r[0], r[3], r[2], r[5], ev['name'], ev['date'], ev['lieu'], r[6]])
    elif style == 3:
        ws.title = 'Inscriptions'; ws.append(['Participant', 'Entreprise', 'Mail', 'RSVP', 'Invité par'])
        for r in rows: ws.append([f"{r[1].upper()} {r[0]}", r[3], r[2], r[5], r[6]])
        ws2 = wb.create_sheet('Présences jour J'); ws2.append(['Nom', 'Prénom', 'Email', 'Présent'])
        for r in rows[:len(rows) // 2]: ws2.append([r[1], r[0], r[2], 'Oui' if random.random() < .7 else 'Non'])
    else:
        ws.title = 'Sheet1'; ws.append(['Voornaam', 'Achternaam', 'E-mailadres', 'Bedrijf', 'Functie', 'Aanwezigheid', 'Contact interne'])
        for r in rows: ws.append([r[0], r[1], r[2], r[3], r[4], random.choice(['Aanwezig', 'Afwezig', 'Ingeschreven', 'Uitgenodigd']), r[6]])
    wb.save(f'{OUT}/{fname}.xlsx')
print(len(cos), 'entreprises', len(people), 'personnes', len(EVENTS), 'événements', len(os.listdir(OUT)), 'fichiers')

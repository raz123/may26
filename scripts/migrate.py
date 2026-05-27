import json, io, sys

# Load GeoJSON
with io.open('src/data/spots.geojson', 'r', encoding='utf-8') as f:
    geojson = json.load(f)

# Load current species
with io.open('src/data/species.json', 'r', encoding='utf-8') as f:
    species = json.load(f)

# Build name -> id mapping
species_map = {}
for s in species:
    species_map[s['name']['en'].lower()] = s['id']
    species_map[s['name']['fr'].lower()] = s['id']

# Comprehensive aliases
aliases = {
    'northern pike': 2, 'grand brochet': 2, 'brochet': 2, 'brochet maille': 2, 'chain pickerel': 2, 'pickerel': 2,
    'brook char': 3, 'brook trout': 3, 'speckled trout': 3, 'omble de fontaine indigene': 3, 'omble de fontaine': 3,
    'brook trout x lake trout': 3, 'truite moulac': 3, 'splake': 3, 'moulac': 3,
    'lake trout': 4, 'lake trout (touladi)': 4, 'touladi': 4, 'grey trout': 4,
    'smallmouth bass': 5, 'achigan a petite bouche': 5,
    'largemouth bass': 6, 'achigan a grande bouche': 6,
    'yellow perch': 8, 'perchaude': 8, 'perch': 8,
    'lake whitefish': 10, 'coregone': 10, 'common whitefish': 10, 'whitefish': 10,
    'round whitefish': 10, 'menomini rond': 10,
    'rainbow trout': 11, 'truite arc-en-ciel': 11, 'truite arc en ciel': 11, 'steelhead': 11,
    'sauger': 12, 'dore noir': 12,
    'walleye': 1, 'dore jaune': 1, 'dore': 1, 'yellow pickerel': 1,
    'muskellunge': 7, 'maskinonge': 7, 'musky': 7, 'muskie': 7,
    'atlantic salmon': 9, 'saumon atlantique': 9, 'truite de mer': 9,
    'bass': 5, 'achigan': 5,
    'white sucker': 13, 'meunier noir': 13, 'meunier rouge': 13, 'longnose sucker': 13,
    'redhorse': 13, 'chevalier sp': 13, 'chevalier rouge': 13, 'shorthead redhorse': 13,
    'chevalier blanc': 13, 'silver redhorse': 13, 'common carp': 13, 'carpe commune': 13,
    'carp': 13, 'laquaiche': 13, 'tench': 13, 'tanche': 13, 'fallfish': 13, 'ouitouche': 13,
    'brown bullhead': 14, 'barbotte brune': 14, 'american eel': 14, 'anguille d amerique': 14,
    'burbot': 15, 'lotte': 15, 'freshwater cod': 15, 'atlantic tomcod': 15, 'poulamon atlantique': 15,
    'tomcod': 15, 'greenland cod': 15, 'morue ogac': 15,
    'lake sturgeon': 16, 'esturgeon jaune': 16, 'sturgeon': 16, 'atlantic sturgeon': 16,
    'esturgeon noir': 16,
    'arctic char': 17, 'omble chevalier': 17,
    'channel catfish': 18, 'barbue de riviere': 18, 'barbue': 18,
    'black crappie': 19, 'marigane noire': 19, 'crappie': 19,
    'landlocked salmon': 20, 'ouananiche': 20, 'landlocked atlantic salmon': 20,
    'lake cisco': 21, 'cisco de lac': 21, 'cisco': 21, 'rainbow smelt': 21,
    'eperlan arc-en-ciel': 21, 'eperlan arc en ciel': 21,
    'striped bass': 22, 'bar rayé': 22, 'bar ray e': 22,
    'brown trout': 23, 'truite brune': 23,
    'rock bass': 24, 'crapet de roche': 24,
    'freshwater drum': 8, 'malachigan': 8,
    'white perch': 8, 'baret': 8,
    'greenland halibut': 10, 'fletan du groenland': 10,
    'acadian redfish': 8, 'sebaste d acadie': 8,
}
species_map.update(aliases)

# New species to add (id 13+)
new_species = [
    {'id': 13, 'name': {'en': 'White Sucker', 'fr': 'Meunier noir'}, 'scientific': 'Catostomus commersonii', 'emoji': '\U0001f41f', 'seasons': ['spring', 'summer'], 'bestTime': {'en': 'Midday in spring spawning runs.', 'fr': 'Midi lors des montaisons printanieres.'}, 'techniques': {'en': 'Light tackle with worms or corn. Commonly caught incidentally.', 'fr': 'Equipement leger avec vers ou mais. Souvent pris accessoirement.'}, 'regulations': {'en': 'No limit in most zones.', 'fr': 'Aucune limite dans la plupart des zones.'}, 'wiki': 'https://en.wikipedia.org/wiki/White_sucker'},
    {'id': 14, 'name': {'en': 'Brown Bullhead', 'fr': 'Barbotte brune'}, 'scientific': 'Ameiurus nebulosus', 'emoji': '\U0001f41f', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Evening and night in warm shallows.', 'fr': 'Soiree et nuit dans les hauts-fonds chauds.'}, 'techniques': {'en': 'Bottom fishing with worms, chicken liver, or stinkbait.', 'fr': 'Peche au fond avec vers, foie de poulet ou appats puants.'}, 'regulations': {'en': 'No minimum size. Daily limit varies.', 'fr': 'Aucune taille minimale. Limite quotidienne variable.'}, 'wiki': 'https://en.wikipedia.org/wiki/Brown_bullhead'},
    {'id': 15, 'name': {'en': 'Burbot', 'fr': 'Lotte'}, 'scientific': 'Lota lota', 'emoji': '\U0001f41f', 'seasons': ['fall', 'winter'], 'bestTime': {'en': 'Night in cold months. Spawns under ice Jan-Feb.', 'fr': 'Nuit pendant les mois froids. Fraie sous glace janv-fev.'}, 'techniques': {'en': 'Ice fishing with tip-ups and large minnows.', 'fr': 'Peche sous glace avec bascules et gros menes.'}, 'regulations': {'en': 'No minimum size in most zones.', 'fr': 'Aucune taille minimale dans la plupart des zones.'}, 'wiki': 'https://en.wikipedia.org/wiki/Burbot'},
    {'id': 16, 'name': {'en': 'Lake Sturgeon', 'fr': 'Esturgeon jaune'}, 'scientific': 'Acipenser fulvescens', 'emoji': '\U0001f41f', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Summer evenings in deep river channels.', 'fr': 'Soirees d ete dans les chenaux profonds.'}, 'techniques': {'en': 'Bottom fishing with worms or chicken liver. Heavy tackle.', 'fr': 'Peche au fond avec vers ou foie de poulet. Equipement lourd.'}, 'regulations': {'en': 'Catch-and-release only in most zones.', 'fr': 'Capture-relache seulement dans la plupart des zones.'}, 'wiki': 'https://en.wikipedia.org/wiki/Lake_sturgeon'},
    {'id': 17, 'name': {'en': 'Arctic Char', 'fr': 'Omble chevalier'}, 'scientific': 'Salvelinus alpinus', 'emoji': '\U0001f3a3', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Early morning in cold northern lakes.', 'fr': 'Tot le matin dans les lacs froids du nord.'}, 'techniques': {'en': 'Fly fishing with streamers. Trolling small spoons.', 'fr': 'Peche a la mouche avec streamers. Traine avec petites cuilleres.'}, 'regulations': {'en': 'Min size and limits vary by northern zone.', 'fr': 'Taille min et limites variables selon la zone nordique.'}, 'wiki': 'https://en.wikipedia.org/wiki/Arctic_char'},
    {'id': 18, 'name': {'en': 'Channel Catfish', 'fr': 'Barbue de riviere'}, 'scientific': 'Ictalurus punctatus', 'emoji': '\U0001f41f', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Night, especially after rain.', 'fr': 'Nuit, surtout apres la pluie.'}, 'techniques': {'en': 'Bottom fishing with cut bait or stinkbait.', 'fr': 'Peche au fond avec appats coupes ou appats puants.'}, 'regulations': {'en': 'Min size varies. Daily limit varies.', 'fr': 'Taille min variable. Limite quotidienne variable.'}, 'wiki': 'https://en.wikipedia.org/wiki/Channel_catfish'},
    {'id': 19, 'name': {'en': 'Black Crappie', 'fr': 'Marigane noire'}, 'scientific': 'Pomoxis nigromaculatus', 'emoji': '\U0001f41f', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Early morning and evening near structure.', 'fr': 'Tot le matin et en soiree pres des structures.'}, 'techniques': {'en': 'Light tackle with small jigs or minnows.', 'fr': 'Equipement leger avec petits jigs ou menes.'}, 'regulations': {'en': 'No minimum size. Daily limit: 15-30.', 'fr': 'Aucune taille minimale. Limite quotidienne: 15-30.'}, 'wiki': 'https://en.wikipedia.org/wiki/Black_crappie'},
    {'id': 20, 'name': {'en': 'Landlocked Salmon', 'fr': 'Ouananiche'}, 'scientific': 'Salmo salar ouananiche', 'emoji': '\U0001f3a3', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Surface feeding at dawn and dusk.', 'fr': 'Alimentation en surface a l aube et au crepuscule.'}, 'techniques': {'en': 'Trolling spoons. Fly fishing with dry flies.', 'fr': 'Traine avec cuilleres. Mouche seche par soirees calmes.'}, 'regulations': {'en': 'Min size varies. Daily limit: 1-3.', 'fr': 'Taille min variable. Limite quotidienne: 1-3.'}, 'wiki': 'https://en.wikipedia.org/wiki/Ouananiche'},
    {'id': 21, 'name': {'en': 'Lake Cisco', 'fr': 'Cisco de lac'}, 'scientific': 'Coregonus artedi', 'emoji': '\U0001f41f', 'seasons': ['spring', 'summer', 'fall', 'winter'], 'bestTime': {'en': 'Evening surface feeding in summer.', 'fr': 'Alimentation en surface en soiree d ete.'}, 'techniques': {'en': 'Light tackle. Ice fishing with tiny spoons.', 'fr': 'Equipement leger. Peche sous glace avec petites cuilleres.'}, 'regulations': {'en': 'No minimum size. Daily limit: 15-30.', 'fr': 'Aucune taille minimale. Limite quotidienne: 15-30.'}, 'wiki': 'https://en.wikipedia.org/wiki/Cisco_(fish)'},
    {'id': 22, 'name': {'en': 'Striped Bass', 'fr': 'Bar rayé'}, 'scientific': 'Morone saxatilis', 'emoji': '\U0001f41f', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Dawn and dusk in river currents.', 'fr': 'Aube et crepuscule dans les courants de riviere.'}, 'techniques': {'en': 'Surf casting with poppers. Trolling crankbaits.', 'fr': 'Lancer de plage avec poppers. Traine avec leurres plongeants.'}, 'regulations': {'en': 'Strict catch-and-release in most QC waters.', 'fr': 'Capture-relache strict dans la plupart des eaux du QC.'}, 'wiki': 'https://en.wikipedia.org/wiki/Striped_bass'},
    {'id': 23, 'name': {'en': 'Brown Trout', 'fr': 'Truite brune'}, 'scientific': 'Salmo trutta', 'emoji': '\U0001f3a3', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Late evening hatches in summer.', 'fr': 'Eclosions tardives en soiree d ete.'}, 'techniques': {'en': 'Fly fishing with nymphs and dry flies.', 'fr': 'Peche a la mouche avec nymphes et mouches seches.'}, 'regulations': {'en': 'Min size varies. Daily limit: 5-10.', 'fr': 'Taille min variable. Limite quotidienne: 5-10.'}, 'wiki': 'https://en.wikipedia.org/wiki/Brown_trout'},
    {'id': 24, 'name': {'en': 'Rock Bass', 'fr': 'Crapet de roche'}, 'scientific': 'Ambloplites rupestris', 'emoji': '\U0001f41f', 'seasons': ['spring', 'summer', 'fall'], 'bestTime': {'en': 'Midday near rocky shorelines.', 'fr': 'Midi pres des rives rocheuses.'}, 'techniques': {'en': 'Light tackle with small jigs or worms.', 'fr': 'Equipement leger avec petits jigs ou vers.'}, 'regulations': {'en': 'No minimum size. Daily limit: 15-30.', 'fr': 'Aucune taille minimale. Limite quotidienne: 15-30.'}, 'wiki': 'https://en.wikipedia.org/wiki/Rock_bass'},
]

# Track unmapped
unmapped = set()

# Build new spots
new_spots = []
spot_id = 1

for feat in geojson['features']:
    p = feat['properties']
    coords = feat['geometry']['coordinates']  # [lng, lat]

    # Map species
    fish_ids = []
    for sp in p.get('species', []):
        if isinstance(sp, dict) and 'en' in sp:
            key = sp['en'].strip().lower()
            sid = species_map.get(key)
            if sid:
                if sid not in fish_ids:
                    fish_ids.append(sid)
            else:
                key_fr = sp.get('fr', '').strip().lower()
                sid = species_map.get(key_fr)
                if sid and sid not in fish_ids:
                    fish_ids.append(sid)
                else:
                    unmapped.add(sp.get('en', '?'))

    # Determine type
    spot_type = p.get('type', 'public')
    if spot_type not in ('public', 'pourvoirie', 'zec'):
        spot_type = 'public'

    # Water body
    milieu = p.get('milieu', 'Lake')
    milieu_map = {
        'lac': 'Lake', 'riviere': 'River', 'rivière': 'River',
        'reservoir': 'Reservoir', 'réservoir': 'Reservoir',
        'fleuve': 'River', 'lake': 'Lake', 'river': 'River'
    }
    milieu_en = milieu_map.get(milieu.lower(), milieu)

    region = p.get('region', 'Unknown') or 'Unknown'

    desc_en = (p.get('description_en') or '').strip()
    desc_fr = (p.get('description_fr') or '').strip()

    spot = {
        'id': spot_id,
        'name': {
            'en': (p.get('name_en') or '').strip() or f'Spot {spot_id}',
            'fr': (p.get('name_fr') or '').strip() or f'Spot {spot_id}'
        },
        'type': spot_type,
        'lat': coords[1],
        'lng': coords[0],
        'region': region,
        'waterBody': milieu_en,
        'description': {
            'en': desc_en or f'Fishing spot in {region}.',
            'fr': desc_fr or f'Spot de peche dans {region}.'
        },
        'fish': fish_ids,
        'pourvoirieUrl': None,
        'imageUrl': None
    }
    new_spots.append(spot)
    spot_id += 1

print(f'Total spots generated: {len(new_spots)}')
print(f'Unmapped species ({len(unmapped)}):')
for u in sorted(unmapped):
    print(f'  - {u}')

# Add new species
for ns in new_species:
    if not any(s['id'] == ns['id'] for s in species):
        species.append(ns)

# Save species
with io.open('src/data/species.json', 'w', encoding='utf-8') as f:
    json.dump(species, f, indent=2, ensure_ascii=False)

# Save spots
with io.open('src/data/spots.json', 'w', encoding='utf-8') as f:
    json.dump(new_spots, f, indent=2, ensure_ascii=False)

print(f'Species count: {len(species)}')
print(f'Spots saved to src/data/spots.json')

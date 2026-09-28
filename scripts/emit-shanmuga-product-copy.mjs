/**
 * Builds per-product descriptions & specs for all price-list items.
 * Run: node scripts/emit-shanmuga-product-copy.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRICE_LIST_SECTIONS } from '../data/shanmuga-price-list-source.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.join(__dirname, '..', 'data', 'shanmuga-product-copy.json')

function titleCase(name) {
  return name
    .split(/\s*\/\s*/)
    .map((part) =>
      part
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/(\d+)\s*([½¼¾])/g, '$1 $2')
        .replace(/(\d+)\s*"/g, '$1 inch'),
    )
    .join(' / ')
}

function extractSize(name, category) {
  const n = name.toUpperCase()
  const cm = name.match(/(\d+)\s*CM/i)
  if (cm) return `${cm[1]} cm length`

  const inch =
    name.match(/(\d+\s*[½¼¾]?)\s*"/) ||
    name.match(/(\d+\s*½)\s*"/) ||
    name.match(/(\d+)\s*"/)
  if (inch) return `${inch[1].trim()} inch`

  if (/\b1\/4\s*KG\b/i.test(name)) return '1/4 kg cake'
  if (/\b1\/2\s*KG\b/i.test(name)) return '1/2 kg cake'
  if (/\b1\s*KG\b/i.test(name) && /ADIYAAL/i.test(name)) return '1 kg cake'

  const kMatch = name.match(/^(\d+)\s*K$/i)
  if (kMatch) return `${kMatch[1]}K display cake`

  const shots = name.match(/(\d+)\s*SHOTS/i)
  if (shots) return `${shots[1]} shots per box`

  if (/20\s*PLY/i.test(name)) return '20 ply roll'

  const pcs = name.match(/\((\d+)\s*Pcs?\)/i)
  if (pcs) return null

  if (/BIJILI/i.test(name)) return 'Standard bijili size'
  if (/SPARKLER/i.test(name) || category === 'Sparklers') return 'Standard sparkler length'
  if (/FLOWER\s*POT/i.test(name)) return 'Standard flower pot'
  if (/CHAKKAR|CHAKKAR|WHEEL|SPINNER/i.test(name)) return 'Ground spinner size'
  if (/ROCKET/i.test(name)) return 'Sky rocket size'
  if (/GOLD\s*LAKSHMI/i.test(name)) return 'Premium Lakshmi pack'

  return 'As per manufacturer pack'
}

function productType(category, name) {
  const map = {
    'Single Sound Crackers': 'Crackers',
    'Electric Crackers': 'Electric crackers (garland)',
    'Bijilli Crackers': 'Bijili crackers',
    Flowerpots: 'Flower pots',
    'Ground Chakkar': 'Ground chakkar / spinner',
    "Children's Special": 'Children’s novelty',
    'Atom Bombs': 'Atom bomb / sound cake',
    'Jaguar Varieties': 'Display cake (Jaguar series)',
    Rockets: 'Rockets',
    'Colour Fountains': 'Colour fountain',
    'New Special Fountains': 'Special fountain',
    'New Wonders': 'Aerial novelty',
    'Chotta Fancy': 'Chotta fancy shots',
    'Night Attraction Fancy': 'Night fancy aerial',
    Multishots: 'Multi-shot cake',
    Novelties: 'Novelty item',
    'Roll Caps & Serpent Eggs': 'Toy / novelty',
    '2026 New Varieties': 'New season special',
    Sparklers: 'Sparklers',
  }
  let type = map[category] || 'Fireworks'
  if (/SPARKLER/i.test(name)) type = 'Sparklers'
  if (/MULTI/i.test(name) && /SHOT/i.test(name)) type = 'Multi-shot cake'
  return type
}

function effectFor(category, name) {
  const u = name.toUpperCase()
  if (/SPARKLER|NANOTECH/i.test(u)) return 'Bright sparks (low smoke on nanotech)'
  if (/SMOKE/i.test(u)) return 'Coloured smoke plume'
  if (/WHISTL|DIXIE/i.test(u)) return 'Spin with whistle'
  if (/WHEEL|CHAKKAR|SPINNER|KANI/i.test(u)) return 'Ground spin & sparks'
  if (/ROCKET|HELICOPTER|DOVE/i.test(u)) return 'Aerial lift & burst'
  if (/SHOT/i.test(u)) return 'Sequential aerial shots'
  if (/BIJILI/i.test(u)) return 'Sharp bijili crackle'
  if (/FLOWER|FOUNTAIN|POT|KOTI/i.test(u)) return 'Fountain of golden & colour sparks'
  if (/BOMB|ADIYAAL|BULLET|JAGUAR|\bK$/i.test(u)) return 'Heavy sound report'
  if (/TWINKLING|STAR|PENCIL|CANDLE|ROMAN/i.test(u)) return 'Colour stars & light effects'
  if (/FLASH|PHOTO/i.test(u)) return 'Bright photo flash'
  if (/CHIT|SERPENT|ROLL CAP|STONE|GUN/i.test(u)) return 'Fun novelty effect'
  if (/CRACKLING|CREACLING/i.test(u)) return 'Crackling light display'
  if (/COLOUR|TRI|PEACOCK|BUTTERFLY/i.test(u)) return 'Multi-colour aerial display'
  if (/ELECTRIC|MEGA|DELUXE|24|50|100/i.test(u) && category === 'Electric Crackers')
    return 'Rapid electric cracker sequence'
  if (category === 'Single Sound Crackers') return 'Loud single burst'
  if (category === 'Multishots') return 'Rapid multi-colour shots'
  return 'Festive light & sound'
}

function durationFor(category, name, effect) {
  const u = name.toUpperCase()
  if (/SPARKLER/i.test(u)) {
    const cm = name.match(/(\d+)\s*CM/i)
    if (cm) {
      const len = parseInt(cm[1], 10)
      if (len <= 10) return '35–50 seconds burn'
      if (len <= 15) return '50–70 seconds burn'
      if (len <= 30) return '70–90 seconds burn'
      return '90–120 seconds burn'
    }
    return '45–90 seconds burn'
  }
  if (/SHOTS/i.test(u)) {
    const m = name.match(/(\d+)\s*SHOTS/i)
    if (m) {
      const shots = parseInt(m[1], 10)
      if (shots <= 30) return '25–40 seconds show'
      if (shots <= 120) return '40–90 seconds show'
      return '90–180 seconds show'
    }
  }
  if (/BOMB|ADIYAAL|JAGUAR|\b\d\s*K$/i.test(u)) return '5–15 seconds report'
  if (/ROCKET/i.test(u)) return '8–20 seconds aerial'
  if (/FOUNTAIN|FLOWER|POT/i.test(u)) return '40–90 seconds fountain'
  if (/CHAKKAR|WHEEL|SPINNER/i.test(u)) return '30–60 seconds spin'
  if (/ELECTRIC/i.test(u) && category === 'Electric Crackers') return '15–45 seconds sequence'
  if (category === 'Single Sound Crackers') return '3–5 seconds'
  if (/SMOKE/i.test(u)) return '30–60 seconds smoke'
  if (/ROLL CAP|SERPENT|CHIT/i.test(u)) return 'Instant to 10 seconds'
  return '10–30 seconds'
}

const OPENERS = [
  (d) => `${d} is a trusted Shanmuga's pick for high-energy Diwali nights.`,
  (d) => `${d} brings Sivakasi-made quality with a celebration-ready performance.`,
  (d) => `${d} is chosen by families who want reliable sound and sparkle.`,
  (d) => `${d} pairs strong value with a name customers ask for every season.`,
  (d) => `${d} is built for open-ground use with clear, festive impact.`,
  (d) => `${d} stands out on the price list for its balance of power and price.`,
  (d) => `${d} is a crowd-pleaser for both small gatherings and big street events.`,
  (d) => `${d} delivers consistent performance from Shanmuga's catalogue.`,
]

const CLOSERS = [
  'Light on a flat, clear surface and keep children at a safe distance.',
  'A popular add-on for mixed cracker trays and gift hampers.',
  'Ideal for the main burst sequence after sparklers and flower pots.',
  'Stock up early—this line moves fast during peak festival weeks.',
  'Follow local safety rules and always keep water or sand nearby.',
  'Best enjoyed in open areas away from roofs and vehicles.',
  'Combine with fountains or ground spinners for a fuller show.',
  'Traditional favourite that suits both first-time buyers and regulars.',
]

const MID_TAGS = [
  'crisp report',
  'rich golden shower',
  'colour-changing stars',
  'steady burn',
  'theatrical aerial height',
  'street-favourite loudness',
  'neighbourhood-safe when used outdoors',
  'premium feel in a standard pack',
]

function productLead(sno, name, category) {
  if (sno === 6) {
    return 'Gold Lakshmi is a classic festive sound cracker with a premium name.'
  }

  const d = titleCase(name)
  const u = name.toUpperCase()

  const bySno = {
    1: `4" Lakshmi Crackers are the entry-level favourite for a sharp, single-shot Diwali burst.`,
    2: `Deluxe Lakshmi steps up the powder load for a fuller report than standard 4" packs.`,
    3: `Super Deluxe Lakshmi / Tiger branding marks one of the strongest singles in this size.`,
    4: `3½" Lakshmi suits buyers who want traditional sound in a slightly smaller roll.`,
    5: `2¾" Kuruv is a budget-friendly kuruvai cracker with a quick, bright crack.`,
    7: `5" Spiderman / Lakshmi pairs kids' branding with a noticeably heavier single shot.`,
    8: `6" Fighter is chosen when you want maximum single-cracker impact in the Lakshmi family.`,
    9: `Lakshmi 20 Ply strings many small reports for a longer roll of sound.`,
    10: `2¾" 24 Deluxe electric strings twenty-four linked shots for continuous festivity.`,
    11: `2¾" 50 Deluxe stretches the electric sequence for a full-minute street show.`,
    12: `4" 50 Mega Deluxe combines larger bore with a fifty-shot electric garland.`,
    13: `4" 100 Mega Deluxe is the long electric garland for buyers who want endurance and volume.`,
    14: `Red Bijili delivers the classic sharp bijili crackle in a handy bag.`,
    15: `Striped Bijili offers the same bijili performance with striped styling.`,
    16: `Flower Pots Big open with a tall golden fountain before the main sparkle.`,
    17: `Flower Pots Special add extra height and colour to the standard pot line.`,
    18: `Flower Pots Ashoka are named for their wide, tree-like shower of sparks.`,
    19: `Flower Pots Deluxe (5 Pcs) bundle five deluxe pots for terrace parties.`,
    20: `Flower Pot Colour Koti mixes koti-style colour breaks in a fountain pot.`,
    21: `Colour Koti Deluxe (10 Pcs) packs ten colour-koti pots for bigger gatherings.`,
    22: `Tri Colour Fountain layers three colour stages in one ground fountain.`,
    23: `Ground Chakkar Big spins a wide circle of sparks on flat ground.`,
    24: `Ground Chakkar Special spins faster with a denser ring of light.`,
    25: `Ground Chakkar Deluxe is the premium chakkar for longer spin time.`,
    26: `Chakkar Special Spinner adds whistle and spin for street-corner fun.`,
    27: `Chakkar Deluxe Spinner is the heavier spinner wheel in this range.`,
    28: `Whistling Dixie (5 Pcs) combines five whistling ground pieces in one box.`,
    29: `4 x 4 Wheel (5 Pcs) packs five four-way driving wheels for kids and teens.`,
    30: `1½" Twinkling Star shoots low aerial stars safe for children's packs.`,
    31: `4" Twinkling Star lifts higher with brighter twinkling breaks.`,
    32: `12" Pencil fires slim roman-style shots from a pencil tube.`,
    33: `Coronation Colour Candle streams colour candles for a regal mini-show.`,
    34: `Roman Candle Red & Green alternates red and green stars up the line.`,
    35: `Raya Pencil Mix bundles mixed pencil effects in one family box.`,
    36: `Jai Ho / Bingo Crackling Candle ends with a crackling candle finish.`,
    37: `Super Bullet is a compact atom bomb with a punchy single report.`,
    38: `Hydro Bomb Green adds a green-flash accent to a heavy sound cake.`,
    39: `Classic Bomb is the mid-size atom bomb trusted for village displays.`,
    40: `Agni Bomb steps up to a deep, rolling thunder report.`,
    41: `Digital Bomb is among the loudest boxes in the atom bomb shelf.`,
    42: `Adiyaal 1/4 kg is a quarter-kilo sound cake for open plots.`,
    43: `Adiyaal 1/2 kg doubles the powder for a longer thunder roll.`,
    44: `Adiyaal 1 kg is the full-kilo cake for the finale of the night.`,
    45: `Jaguar 1 K is the entry display cake in the Jaguar series.`,
    46: `Jaguar 2 K doubles shots and duration for medium finales.`,
    47: `Jaguar 5 K is built for society grounds and wide-open fields.`,
    48: `Jaguar 10 K is the show-stopper cake for the biggest celebrations.`,
    49: `Rocket Bomb lifts a bursting head with a rocket-style whoosh.`,
    50: `Lunik Rocket climbs high with a classic rocket trail.`,
    51: `2 Sound Rocket cracks twice in the sky for double applause.`,
    52: `Music Rocket adds whistling music notes to the climb and burst.`,
    53: `Peacock Feather fountain opens like a peacock tail of colour.`,
    54: `WiFi (5 Pcs) packs five modern fountain cakes with network-themed fun.`,
    55: `Nano (5 Pcs) are compact nano fountains for table-top displays.`,
    56: `Jazz (5 Pcs) rhythm-themed fountains with jazz-burst colour.`,
    57: `Music Siren (3 Pcs) wails musically before the colour fountain.`,
    58: `Sunfeast / Bourbon Red (5 Pcs) biscuit-tin styled fountains kids recognise.`,
    59: `Nano Pots (Ayyan) (5 Pcs) mini pots with Ayyan-series sparkle.`,
    60: `Party Mix (5 Pcs) mixes five different fountain personalities in one box.`,
    61: `Shin Chan (5 Pcs) cartoon-themed fountains for young families.`,
    62: `Jiggles (4 Varieties) (3 Pcs) jiggling multi-effect fountain set.`,
    63: `Doraemon (5 Pcs) character fountains with gentle colour showers.`,
    64: `Silver / Golden Drops rain metallic droplets from a slim fountain.`,
    65: `Crackling Salsa (1 Pcs) is a single large crackling fountain cake.`,
    66: `Fire Tiger roars with tiger-themed colour and crackle.`,
    67: `Peacock 3 in 1 cycles three peacock colour stages.`,
    68: `Magic Show Currency fountain plays a magic-money themed shower.`,
    69: `Colour Smoke (3 Pcs) Multi releases multi-colour smoke columns.`,
    70: `Helicopter blades spin up and lift like a toy copter.`,
    71: `Rampa Dance / Pambaraa jumps and dances on the ground.`,
    72: `Butterfly (3 Colour Changing) flutters through three colour changes.`,
    73: `Bada Peacock is an oversized peacock aerial for premium finales.`,
    74: `Kids Bat & Ball is a sports-themed novelty kids love to light.`,
    75: `1" Chotta Fancy is the small-bore fancy for quick sky colour.`,
    76: `Sky Crack / Sky Dance (5 Pcs) crack and dance across five pieces.`,
    77: `Penta Shot (5 Pcs) fires five coordinated fancy bursts.`,
    78: `White House (5 Pcs) monument-themed fancy shots.`,
    79: `2UP (5 Pcs) arcade-themed doubles for teen groups.`,
    80: `Focus fountain narrows sparks into a bright column.`,
    81: `Magic Money shower looks like raining currency sparks.`,
    82: `Singing Doll plays a singing novelty before the colour break.`,
    83: `3½" Fancy (6 Varieties) rotates six fancy effects in one box.`,
    84: `2" Single is one large night fancy for a solo sky painting.`,
    85: `2" 3 Pcs triples the same fancy effect for a short sequence.`,
    86: `BS Chotta 5 in 1 bundles five chotta effects from the BS line.`,
    87: `BS 3½" Fancy is the BS-series mid fancy for height and colour.`,
    88: `BS 7 Step climbs seven colour steps into the sky.`,
    89: `BS 3½" Fancy 2 Pcs pairs two heavy BS fancys.`,
    90: `Lovely 3½" Fancy 2 Pcs 2 Ball adds double-ball breaks to Lovely fancys.`,
    91: `Lovely 6" Orange (2 Pcs) is a large-bore orange fancy pair.`,
    92: `12 Shots opens a compact multi-shot cake for small budgets.`,
    93: `30 Shots Multi Colour paints the sky with thirty colour breaks.`,
    94: `60 Shots Multi Colour doubles the shot count for longer shows.`,
    95: `120 Shots Multi Colour is a full-minute aerial for housing societies.`,
    96: `240 Shots Multi Colour keeps the sky busy for big plot celebrations.`,
    97: `520 Shots Multi Colour is the ultimate multi-shot for grand finales.`,
    98: `Chit Put pops with the classic chit-put novelty sound.`,
    99: `Kani Wheel drives sparks in a tight kani wheel pattern.`,
    100: `Photo Flash gives a camera-flash burst for photo moments.`,
    101: `Money in the Bank is a novelty bank-themed fountain sparkler.`,
    102: `Serpent Egg grows a serpent ash trail kids watch closely.`,
    103: `Electric Stone snaps with the electric stone novelty effect.`,
    104: `Roll Cap supplies caps for toy guns in festival games.`,
    105: `A.K 47 Ring Gun (5 Ring Cap) toy gun bundle with ring caps.`,
    106: `Smoke Stick pours a thick smoke stick column for daytime fun.`,
    107: `Purple Dove / Little Dove releases dove-style aerial smoke or light.`,
    108: `Gulfi is a new-season gulfi novelty from the 2026 list.`,
    109: `Bad Boys Tin (3 Pcs) packs three tin-style fountain cakes.`,
    110: `Fire Egg hatches a crackling egg novelty on the ground.`,
    111: `10 cm Electric Sparklers are short electric gold wire sparklers.`,
    112: `10 cm Colour Sparklers add colour sparks in a child-friendly length.`,
    113: `10 cm Green Sparklers burn with a green-tinted spark trail.`,
    114: `10 cm Red Sparklers glow red for traditional photo moments.`,
    115: `10 cm Nanotech (Smoke Free) sparklers reduce smoke for indoor porches.`,
    116: `15 cm Electric Sparklers give a longer electric burn for adults.`,
    117: `15 cm Colour Sparklers extend colour sparkle time.`,
    118: `15 cm Green Sparklers are the green 15 cm line for mix trays.`,
    119: `15 cm Red Sparklers are classic red 15 cm sparklers.`,
    120: `15 cm Nanotech (Smoke Free) offers low-smoke 15 cm burns.`,
    121: `30 cm Electric Sparklers are hand-held showpieces for the main puja.`,
    122: `30 cm Colour Sparklers mix colour in a 30 cm length.`,
    123: `30 cm Green Sparklers trail green sparks for thirty centimetres.`,
    124: `30 cm Red Sparklers are long red sparklers for group photos.`,
    125: `30 cm Nanotech (Smoke Free) keeps longer burns cleaner.`,
    126: `Lovely Sparklers are the premium Lovely-branded sparkler bundle.`,
    127: `50 cm Electric Sparklers are extra-long electric wires for leaders.`,
    128: `50 cm Colour Sparklers give the longest colour sparkle in the list.`,
    129: `Colour Matches Gold VIP (Laptop) matchbox-style colour sparklers.`,
    130: `Colour Matches 5 Star matchbox five-star colour sparks.`,
    131: `Colour Matches 10 in 1 (Mini Laptop) ten match trays in one laptop box.`,
    132: `Rotating Sparklers spin at the tip while they burn.`,
  }

  if (bySno[sno]) return bySno[sno]

  if (u.includes('LAKSHMI')) return `${d} continues the trusted Lakshmi cracker tradition with Shanmuga's quality control.`
  if (u.includes('SPARKLER')) return `${d} keeps hands and faces lit safely when used outdoors at arm's length.`
  if (u.includes('ROCKET')) return `${d} needs a clear sky lane and a stable launch tube or bottle.`

  const opener = OPENERS[sno % OPENERS.length](d)
  return opener.replace(/\.$/, '') + `.`
}

function buildDescription(sno, display, category, name) {
  const lead = productLead(sno, name, category)
  if (sno === 6) {
    return `${lead}\nA traditional pick for family Diwali celebrations.`
  }
  const closer = CLOSERS[(sno * 7) % CLOSERS.length]
  const mid = MID_TAGS[(sno * 3) % MID_TAGS.length]
  return `${lead}\nFrom our ${category} line—${mid}. ${closer}`
}

const copyBySno = {}

for (const section of PRICE_LIST_SECTIONS) {
  for (const item of section.items) {
    const display = titleCase(item.name)
    const size = extractSize(item.name, section.name)
    const type = productType(section.name, item.name)
    const effect = effectFor(section.name, item.name)
    const duration = durationFor(section.name, item.name, effect)

    let specifications = {
      Type: type,
      Effect: effect,
      Duration: duration,
      Per: item.per,
    }
    if (size) specifications.Size = size
    if (item.sno === 6) {
      specifications = {
        Size: '2 3/4 inch',
        Type: 'Crackers',
        Effect: 'Loud Sound',
        Duration: '3–5 seconds',
        Per: item.per,
      }
    }

    copyBySno[item.sno] = {
      description: buildDescription(item.sno, display, section.name, item.name),
      specifications,
    }
  }
}

fs.writeFileSync(outPath, JSON.stringify(copyBySno, null, 2))
console.log(`Wrote ${Object.keys(copyBySno).length} product copy entries to ${outPath}`)

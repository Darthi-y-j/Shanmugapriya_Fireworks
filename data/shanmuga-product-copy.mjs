import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const jsonPath = path.join(__dirname, 'shanmuga-product-copy.json')

let cached = null

function loadCopyBySno() {
  if (cached) return cached
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Missing ${jsonPath}. Run: node scripts/emit-shanmuga-product-copy.mjs`)
  }
  cached = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  return cached
}

/** Customer-facing description + Size/Type/Effect/Duration specs for a price-list item. */
export function buildProductCopy(item, categoryName) {
  const bySno = loadCopyBySno()
  const entry = bySno[String(item.sno)] ?? bySno[item.sno]
  if (!entry) {
    return {
      description: `${item.name} from Shanmuga's ${categoryName} collection.\nQuality Sivakasi fireworks for your celebration.`,
      specifications: {
        Size: 'As per pack',
        Type: categoryName,
        Effect: 'Festive display',
        Duration: '10–30 seconds',
        Per: item.per,
      },
    }
  }
  const { Pack: _pack, Per: _per, ...restSpecs } = entry.specifications ?? {}
  return {
    description: entry.description,
    specifications: { ...restSpecs, Per: item.per },
  }
}

import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const publicDir = path.resolve('public')

const SKIP_DIRS = new Set(['brands'])
const SKIP_NAME = /^favicon|^apple-touch|^og-share|^prime-logo/i
const MIN_BYTES = 48 * 1024

function collectRasterFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) collectRasterFiles(full, out)
      continue
    }
    if (!/\.(png|jpe?g)$/i.test(entry.name) || SKIP_NAME.test(entry.name)) continue
    if (fs.statSync(full).size < MIN_BYTES) continue
    out.push(path.relative(publicDir, full).replace(/\\/g, '/'))
  }
  return out
}

function maxWidthFor(file) {
  if (/login-card/i.test(file)) {
    return 800
  }
  if (/login-bg|account-bg/i.test(file)) {
    return 1200
  }
  if (/step-bg|card\.|wide-variety|competitive|customer-support|trusted-service|fast-delivery|premium-quality/i.test(file)) {
    return 960
  }
  if (/hero|header|bg|cta|storefront|works|visit|story|account|login|safety|contact|festive|page-header|why-choose/i.test(file)) {
    return 1920
  }
  return 1400
}

function webpQualityFor(file) {
  if (/login|account-bg|card\.|step-bg/i.test(file)) return 72
  return 80
}

async function optimizeImage(relativePath) {
  const input = path.join(publicDir, relativePath)
  const webpName = relativePath.replace(/\.(png|jpe?g)$/i, '.webp')
  const output = path.join(publicDir, webpName)
  const before = fs.statSync(input).size
  const maxWidth = maxWidthFor(relativePath)
  const quality = webpQualityFor(relativePath)

  await sharp(input)
    .resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality, effort: 4 })
    .toFile(output)

  const after = fs.statSync(output).size
  const saved = Math.round((1 - after / before) * 100)
  console.log(`Wrote ${webpName} (${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB, −${saved}%)`)
}

const files = collectRasterFiles(publicDir)
console.log(`Optimizing ${files.length} raster images…`)
for (const file of files) {
  await optimizeImage(file)
}
console.log('Public image WebP optimization complete.')

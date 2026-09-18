import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const publicDir = path.resolve('public')

const SKIP_PATTERN = /(?:^|[\\/])(?:favicon|apple-touch|og-share|prime-logo|brands[\\/])/i
const MIN_BYTES = 24 * 1024

function collectWebpFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectWebpFiles(full, out)
      continue
    }
    if (!/\.webp$/i.test(entry.name)) continue
    const rel = path.relative(publicDir, full).replace(/\\/g, '/')
    if (SKIP_PATTERN.test(rel)) continue
    if (fs.statSync(full).size < MIN_BYTES) continue
    out.push(rel)
  }
  return out
}

function findSource(webpRel) {
  const base = webpRel.replace(/\.webp$/i, '')
  for (const ext of ['.png', '.jpg', '.jpeg', '.webp']) {
    const candidate = `${base}${ext}`
    if (fs.existsSync(path.join(publicDir, candidate))) return candidate
  }
  return webpRel
}

/** Per-file resize + quality tuned for how the asset is displayed on the site. */
function settingsFor(file) {
  if (/home-hero-bg-\d+\.webp$/i.test(file)) {
    const width = Number(file.match(/-(\d+)\.webp$/i)?.[1] ?? 1600)
    return { maxWidth: width, quality: 58 }
  }

  if (/hero-boy|story-center|craftsmanship|sivakasi|palm-skyline/i.test(file)) {
    return { maxWidth: 720, quality: 70 }
  }

  if (/card|faq-item|trust-card|purpose-card|why-choose-card|brand-card/i.test(file)) {
    return { maxWidth: 640, quality: 55 }
  }

  if (/logo|site-logo/i.test(file)) {
    return { maxWidth: 160, quality: 72 }
  }

  if (/rangoli|mandala|mobile-bg|content-bg|connect|footer|service-bar/i.test(file)) {
    return { maxWidth: 1100, quality: 56 }
  }

  if (/hero|header|banner|page-bg|cta-bg|festive|products-page/i.test(file)) {
    return { maxWidth: 1280, quality: 60 }
  }

  if (/bg|background|account|login|auth|safety|story|visit|works/i.test(file)) {
    return { maxWidth: 1200, quality: 58 }
  }

  return { maxWidth: 1000, quality: 64 }
}

async function recompress(relativePath) {
  const inputRel = findSource(relativePath)
  const input = path.join(publicDir, inputRel)
  const output = path.join(publicDir, relativePath)
  if (!fs.existsSync(input)) {
    console.warn(`Skip missing: ${inputRel}`)
    return
  }

  const before = fs.existsSync(output) ? fs.statSync(output).size : fs.statSync(input).size
  const { maxWidth, quality } = settingsFor(relativePath)

  const data = await sharp(input)
    .resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toBuffer()

  try {
    fs.writeFileSync(output, data)
  } catch (error) {
    console.warn(`Skip locked ${relativePath}: ${error instanceof Error ? error.message : error}`)
    return
  }

  const after = data.length
  const saved = before > 0 ? Math.round((1 - after / before) * 100) : 0
  console.log(
    `Wrote ${relativePath} (${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB, −${saved}%)`,
  )
}

async function ensureHeroVariants() {
  const heroBase = 'images/home/home-hero-bg'
  const source = findSource(`${heroBase}.webp`)
  if (!fs.existsSync(path.join(publicDir, source))) return

  const variants = [
    { file: `${heroBase}-800.webp`, maxWidth: 800, quality: 58 },
    { file: `${heroBase}-1200.webp`, maxWidth: 1200, quality: 58 },
    { file: `${heroBase}-1600.webp`, maxWidth: 1600, quality: 58 },
    { file: `${heroBase}.webp`, maxWidth: 1600, quality: 58 },
  ]

  for (const variant of variants) {
    await recompress(variant.file)
  }
}

const files = collectWebpFiles(publicDir)
console.log(`Recompressing ${files.length} WebP assets…`)
for (const file of files) {
  await recompress(file)
}
await ensureHeroVariants()
console.log('WebP recompression complete.')

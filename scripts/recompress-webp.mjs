import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const publicDir = path.resolve('public')

function findSource(file) {
  const png = file.replace(/\.webp$/i, '.png')
  if (fs.existsSync(path.join(publicDir, png))) return png
  return file
}

const HERO_SOURCE = findSource('images/home/home-hero-bg.webp')

/** Recompress / resize WebP assets flagged by PageSpeed. */
const TARGETS = [
  { file: 'images/home/home-hero-bg-800.webp', source: HERO_SOURCE, maxWidth: 800, quality: 62 },
  { file: 'images/home/home-hero-bg-1200.webp', source: HERO_SOURCE, maxWidth: 1200, quality: 62 },
  { file: 'images/home/home-hero-bg-1600.webp', source: HERO_SOURCE, maxWidth: 1600, quality: 62 },
  { file: 'images/home/home-hero-bg.webp', source: HERO_SOURCE, maxWidth: 1600, quality: 62 },
  { file: 'images/home/home-promo-banner.webp', maxWidth: 1400, quality: 66 },
  { file: 'images/home/home-service-bar-bg.webp', maxWidth: 1000, quality: 70 },
  { file: 'images/about/about-rangoli-bg.webp', maxWidth: 1400, quality: 66 },
  { file: 'images/footer-bg.webp', maxWidth: 1200, quality: 68 },
]

async function recompress({ file, source, maxWidth, quality }) {
  const inputRel = source ?? findSource(file)
  const input = path.join(publicDir, inputRel)
  const output = path.join(publicDir, file)
  if (!fs.existsSync(input)) {
    console.warn(`Skip missing: ${inputRel}`)
    return
  }

  const before = fs.existsSync(output) ? fs.statSync(output).size : fs.statSync(input).size

  const data = await sharp(input)
    .resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality, effort: 5 })
    .toBuffer()

  try {
    fs.writeFileSync(output, data)
  } catch (error) {
    console.warn(`Skip locked ${file}: ${error instanceof Error ? error.message : error}`)
    return
  }

  const after = data.length
  const saved = Math.round((1 - after / before) * 100)
  console.log(`Wrote ${file} (${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB, −${saved}%)`)
}

for (const target of TARGETS) {
  await recompress(target)
}

console.log('WebP recompression complete.')

import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const publicDir = path.resolve('public')

async function writeWebp(inputRel, outputRel, size, quality = 78) {
  const input = path.join(publicDir, inputRel)
  const output = path.join(publicDir, outputRel)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  if (!fs.existsSync(input)) {
    console.warn(`Skip missing: ${inputRel}`)
    return
  }
  await sharp(input)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .webp({ quality, effort: 4 })
    .toFile(output)
  const kb = Math.round(fs.statSync(output).size / 1024)
  console.log(`Wrote ${outputRel} (${kb} KB)`)
}

await writeWebp('images/brands/sky-fairy-logo.png', 'images/brands/sky-fairy-logo-sm.webp', 128)
await writeWebp('shanmuga-priya-logo.png', 'images/ui/site-logo-sm.webp', 128)

import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const publicDir = path.resolve('public')
const source = path.join(publicDir, 'shanmuga-priya-logo.png')

/** Trim padding, then export crisp tab/PWA icons from the Shanmuga Priya logo. */
async function buildFavicon(size, outputName, trim = true) {
  let pipeline = sharp(source)
  if (trim) {
    pipeline = pipeline.trim({ threshold: 12 })
  }

  await pipeline
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(publicDir, outputName))

  console.log(`Wrote ${outputName} (${size}x${size})`)
}

await buildFavicon(32, 'favicon-32x32.png')
await buildFavicon(32, 'favicon.png')
await buildFavicon(192, 'favicon-192x192.png')
await buildFavicon(512, 'apple-touch-icon.png')

// Legacy browsers look for /favicon.ico at the site root.
const favicon32 = path.join(publicDir, 'favicon-32x32.png')
const faviconIco = path.join(publicDir, 'favicon.ico')
fs.copyFileSync(favicon32, faviconIco)
console.log('Wrote favicon.ico (copied from favicon-32x32.png)')

/** WhatsApp / Facebook share card — 1200×630 with the Shanmuga Priya logo. */
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const OG_LOGO = 340
const logoBuffer = await sharp(source)
  .trim({ threshold: 12 })
  .resize(OG_LOGO, OG_LOGO, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer()

const brandLabelSvg = Buffer.from(
  `<svg width="${OG_WIDTH}" height="140" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="52" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" fill="#FFFFFF">Shanmuga Priya Crackers</text>
    <text x="50%" y="104" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600" fill="#E8C56A">Your Festival, Our Passion · Sivakasi</text>
  </svg>`,
)

const ogCard = await sharp({
  create: {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    channels: 3,
    background: { r: 15, g: 40, b: 71 },
  },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="glow" cx="50%" cy="42%" r="58%">
              <stop offset="0%" stop-color="#1A3D66"/>
              <stop offset="100%" stop-color="#0F2847"/>
            </radialGradient>
          </defs>
          <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#glow)"/>
          <rect x="0" y="0" width="${OG_WIDTH}" height="14" fill="#C9A24A"/>
          <rect x="0" y="${OG_HEIGHT - 14}" width="${OG_WIDTH}" height="14" fill="#C9A24A"/>
        </svg>`,
      ),
      top: 0,
      left: 0,
    },
    { input: logoBuffer, top: 96, left: Math.floor((OG_WIDTH - OG_LOGO) / 2) },
    { input: brandLabelSvg, top: 430, left: 0 },
  ])
  .png()
  .toBuffer()

await sharp(ogCard).toFile(path.join(publicDir, 'og-share.png'))
console.log('Wrote og-share.png (1200x630 Shanmuga Priya share card)')

console.log('Favicon generation complete.')

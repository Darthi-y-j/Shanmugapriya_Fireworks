import fs from 'node:fs'
import path from 'node:path'

const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml')

export default function handler(req, res) {
  let xml = null
  try {
    if (fs.existsSync(SITEMAP_PATH)) {
      xml = fs.readFileSync(SITEMAP_PATH, 'utf8')
    }
  } catch {
    xml = null
  }

  if (!xml || !xml.includes('<urlset')) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Sitemap unavailable')
    return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.end(xml)
}

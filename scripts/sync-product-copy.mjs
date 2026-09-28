/**
 * Update description & specifications for all catalogue products (no delete).
 * Auth: SUPABASE_SERVICE_ROLE_KEY or ADMIN_EMAIL + ADMIN_PASSWORD in .env
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function loadEnvFile() {
  const envPath = path.join(root, '.env')
  if (!fs.existsSync(envPath)) return {}
  const env = {}
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

const env = { ...loadEnvFile(), ...process.env }
const supabaseUrl = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = env.ADMIN_EMAIL
const adminPassword = env.ADMIN_PASSWORD

if (!supabaseUrl || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const catalogPath = path.join(root, 'data', 'catalog.json')
const { products } = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey)

async function ensureAdminSession() {
  if (serviceRoleKey) return
  if (!adminEmail || !adminPassword) {
    throw new Error('Set SUPABASE_SERVICE_ROLE_KEY or ADMIN_EMAIL + ADMIN_PASSWORD in .env')
  }
  const { error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  })
  if (error) throw error
}

async function main() {
  await ensureAdminSession()
  let updated = 0
  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .update({
        description: product.description,
        specifications: product.specifications,
      })
      .eq('slug', product.slug)
    if (error) {
      console.error(`Failed ${product.slug}:`, error.message)
      continue
    }
    updated += 1
  }
  console.log(`Updated description/specs for ${updated}/${products.length} products`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})

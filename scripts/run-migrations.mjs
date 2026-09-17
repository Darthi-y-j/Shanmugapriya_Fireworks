/**
 * Apply supabase/migrations/*.sql to the linked remote database.
 *
 * Requires in .env:
 *   VITE_SUPABASE_URL
 *   SUPABASE_DB_PASSWORD  — Project Settings → Database → Database password
 *
 * Usage: npm run db:migrate
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import postgres from 'postgres'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const migrationsDir = path.join(root, 'supabase', 'migrations')

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

function projectRefFromUrl(url) {
  const match = url?.match(/https:\/\/([^.]+)\.supabase\.co/)
  return match?.[1]
}

function getMigrationFiles() {
  return fs
    .readdirSync(migrationsDir)
    .filter((name) => name.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function main() {
  const env = { ...loadEnvFile(), ...process.env }
  const supabaseUrl = env.VITE_SUPABASE_URL
  const dbPassword = env.SUPABASE_DB_PASSWORD
  const projectRef = env.SUPABASE_PROJECT_REF || projectRefFromUrl(supabaseUrl)

  if (!projectRef) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_PROJECT_REF in .env')
    process.exit(1)
  }

  if (!dbPassword) {
    console.error(
      'Missing SUPABASE_DB_PASSWORD in .env\n' +
        'Get it from Supabase Dashboard → Project Settings → Database → Database password',
    )
    process.exit(1)
  }

  const region = env.SUPABASE_REGION || 'ap-southeast-1'
  const host = env.SUPABASE_DB_HOST || `aws-0-${region}.pooler.supabase.com`
  const connectionString =
    env.SUPABASE_DB_URL ||
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@${host}:5432/postgres`

  const files = getMigrationFiles()
  if (files.length === 0) {
    console.error(`No migration files in ${migrationsDir}`)
    process.exit(1)
  }

  console.log(`Connecting to ${projectRef} (${host})…`)
  const sql = postgres(connectionString, { ssl: 'require', max: 1 })

  try {
    for (const file of files) {
      const filePath = path.join(migrationsDir, file)
      const body = fs.readFileSync(filePath, 'utf8').trim()
      if (!body) {
        console.log(`Skip empty: ${file}`)
        continue
      }
      process.stdout.write(`Applying ${file}… `)
      await sql.unsafe(body)
      console.log('ok')
    }

    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public'`
    console.log(`Done. ${files.length} migration(s) applied. Public tables: ${count}`)
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

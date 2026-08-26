import { spawnSync } from 'node:child_process'

import dotenv from 'dotenv'

import { applyDatabaseEnv } from '../src/config/database-target'

dotenv.config()
applyDatabaseEnv()

const prismaArgs = process.argv.slice(2)

if (prismaArgs.length === 0) {
  console.error('Usage: tsx scripts/with-database-env.ts <prisma-command> [...args]')
  process.exit(1)
}

const result = spawnSync('npx', ['prisma', ...prismaArgs], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
  shell: true,
})

process.exit(result.status ?? 1)

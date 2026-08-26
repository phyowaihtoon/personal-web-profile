import { execSync } from 'node:child_process'

import { applyDatabaseEnv } from '../src/config/database-target'

process.env.NODE_ENV = 'test'
process.env.PORT = '4100'
process.env.DATABASE_TARGET = process.env.DATABASE_TARGET ?? 'onprem'
process.env.DATABASE_URL =
	process.env.TEST_DATABASE_URL ??
	process.env.DATABASE_URL ??
	'postgresql://postgres:postgres@localhost:5432/personal_web_profile_test?schema=public'
process.env.JWT_ACCESS_SECRET = 'test-access-secret-12345'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-12345'
process.env.JWT_ACCESS_EXPIRES_IN = '15m'
process.env.JWT_REFRESH_EXPIRES_IN = '7d'
process.env.CORS_ORIGIN = 'http://localhost:5173'
process.env.APP_LOCALE_DEFAULT = 'en'
process.env.UPLOAD_DIR = 'test-uploads'
process.env.MAX_UPLOAD_SIZE_MB = '5'
process.env.COOKIE_SECURE = 'false'

applyDatabaseEnv()

if (process.env.SKIP_PRISMA_DB_PUSH !== 'true') {
	try {
		execSync('npx prisma db push --skip-generate', {
			cwd: process.cwd(),
			env: process.env,
			stdio: 'pipe',
		})
	} catch (error) {
		const details =
			error instanceof Error && 'stderr' in error
				? String((error as { stderr?: Buffer | string }).stderr)
				: error instanceof Error
					? error.message
					: String(error)
		throw new Error(
			`Failed to prepare PostgreSQL test database. Ensure PostgreSQL is running and DATABASE_URL/TEST_DATABASE_URL is correct.\n${details}`,
		)
	}
}

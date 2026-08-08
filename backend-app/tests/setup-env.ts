import { execSync } from 'node:child_process'

process.env.NODE_ENV = 'test'
process.env.PORT = '4100'
process.env.DATABASE_URL = 'file:./test.db'
process.env.JWT_ACCESS_SECRET = 'test-access-secret-12345'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-12345'
process.env.JWT_ACCESS_EXPIRES_IN = '15m'
process.env.JWT_REFRESH_EXPIRES_IN = '7d'
process.env.CORS_ORIGIN = 'http://localhost:5173'
process.env.APP_LOCALE_DEFAULT = 'en'
process.env.UPLOAD_DIR = 'test-uploads'
process.env.MAX_UPLOAD_SIZE_MB = '5'
process.env.COOKIE_SECURE = 'false'

execSync('npx prisma db push --skip-generate', {
	cwd: process.cwd(),
	env: process.env,
	stdio: 'ignore',
})
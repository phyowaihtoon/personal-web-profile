import {
	applyDatabaseEnv,
	parseDatabaseTarget,
	resolveDatabaseEnv,
} from '../src/config/database-target'

describe('database-target', () => {
	const originalEnv = { ...process.env }

	afterEach(() => {
		process.env = { ...originalEnv }
	})

	it('defaults DATABASE_TARGET to onprem', () => {
		expect(parseDatabaseTarget(undefined)).toBe('onprem')
	})

	it('resolves onprem from DATABASE_URL', () => {
		const resolved = resolveDatabaseEnv({
			DATABASE_TARGET: 'onprem',
			DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/app',
		})

		expect(resolved).toEqual({
			databaseTarget: 'onprem',
			databaseUrl: 'postgresql://postgres:postgres@localhost:5432/app',
			directUrl: 'postgresql://postgres:postgres@localhost:5432/app',
		})
	})

	it('resolves supabase from dedicated URLs', () => {
		const resolved = resolveDatabaseEnv({
			DATABASE_TARGET: 'supabase',
			SUPABASE_DATABASE_URL: 'postgresql://pooler/db',
			SUPABASE_DIRECT_URL: 'postgresql://direct/db',
		})

		expect(resolved).toEqual({
			databaseTarget: 'supabase',
			databaseUrl: 'postgresql://pooler/db',
			directUrl: 'postgresql://direct/db',
		})
	})

	it('applies resolved URLs onto process.env', () => {
		applyDatabaseEnv({
			DATABASE_TARGET: 'supabase',
			SUPABASE_DATABASE_URL: 'postgresql://pooler/db',
			SUPABASE_DIRECT_URL: 'postgresql://direct/db',
		})

		expect(process.env.DATABASE_TARGET).toBe('supabase')
		expect(process.env.DATABASE_URL).toBe('postgresql://pooler/db')
		expect(process.env.DIRECT_URL).toBe('postgresql://direct/db')
	})

	it('fails when required URLs are missing', () => {
		expect(() =>
			resolveDatabaseEnv({
				DATABASE_TARGET: 'onprem',
			}),
		).toThrow(/DATABASE_URL is required/)

		expect(() =>
			resolveDatabaseEnv({
				DATABASE_TARGET: 'supabase',
				SUPABASE_DATABASE_URL: 'postgresql://pooler/db',
			}),
		).toThrow(/SUPABASE_DIRECT_URL is required/)
	})
})

import {
	isUploadStorageEnabled,
	parseUploadStorage,
	resolveUploadStorageEnv,
	usesLocalUploadStorage,
} from '../src/config/upload-storage'

describe('upload-storage', () => {
	it('defaults UPLOAD_STORAGE to disabled', () => {
		expect(parseUploadStorage(undefined)).toBe('disabled')
		expect(parseUploadStorage('')).toBe('disabled')
		expect(resolveUploadStorageEnv({})).toBe('disabled')
		expect(isUploadStorageEnabled('disabled')).toBe(false)
		expect(usesLocalUploadStorage('local')).toBe(true)
		expect(usesLocalUploadStorage('s3')).toBe(false)
		expect(usesLocalUploadStorage('vercel-blob')).toBe(false)
	})

	it('accepts s3 and vercel-blob targets', () => {
		expect(parseUploadStorage('s3')).toBe('s3')
		expect(parseUploadStorage('vercel-blob')).toBe('vercel-blob')
	})

	it('rejects unknown storage targets', () => {
		expect(() => parseUploadStorage('gcs')).toThrow(/UPLOAD_STORAGE must be one of/)
	})

	it('keeps local storage when not running on Vercel', () => {
		expect(resolveUploadStorageEnv({ UPLOAD_STORAGE: 'local' })).toBe('local')
	})

	it('disables local storage on Vercel so boot does not require a writable disk', () => {
		expect(
			resolveUploadStorageEnv({
				UPLOAD_STORAGE: 'local',
				VERCEL: '1',
			}),
		).toBe('disabled')
	})

	it('disables s3 when Spaces credentials are incomplete', () => {
		expect(
			resolveUploadStorageEnv({
				UPLOAD_STORAGE: 's3',
				SPACES_REGION: 'sgp1',
			}),
		).toBe('disabled')
	})

	it('enables s3 when Spaces credentials are complete', () => {
		expect(
			resolveUploadStorageEnv({
				UPLOAD_STORAGE: 's3',
				SPACES_REGION: 'sgp1',
				SPACES_ENDPOINT: 'sgp1.digitaloceanspaces.com',
				SPACES_BUCKET: 'media',
				SPACES_ACCESS_KEY_ID: 'key',
				SPACES_SECRET_ACCESS_KEY: 'secret',
			}),
		).toBe('s3')
	})

	it('disables vercel-blob when the token is missing', () => {
		expect(
			resolveUploadStorageEnv({
				UPLOAD_STORAGE: 'vercel-blob',
			}),
		).toBe('disabled')
	})

	it('enables vercel-blob when the token is present', () => {
		expect(
			resolveUploadStorageEnv({
				UPLOAD_STORAGE: 'vercel-blob',
				BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_token',
			}),
		).toBe('vercel-blob')
	})
})

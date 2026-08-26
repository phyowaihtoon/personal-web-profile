import fs from 'node:fs'
import path from 'node:path'

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { del, put } from '@vercel/blob'

import { env } from '../config/env'
import { AppError } from '../utils/app-error'

type UploadRecord = {
  storedName: string
  path: string
}

type SavedUpload = {
  storedName: string
  publicPath: string
}

let cachedS3Client: S3Client | null = null

function createS3Client() {
  const endpoint = env.SPACES_ENDPOINT.startsWith('http') ? env.SPACES_ENDPOINT : `https://${env.SPACES_ENDPOINT}`
  return new S3Client({
    region: env.SPACES_REGION,
    endpoint,
    credentials: {
      accessKeyId: env.SPACES_ACCESS_KEY_ID,
      secretAccessKey: env.SPACES_SECRET_ACCESS_KEY,
    },
  })
}

function getS3Client() {
  if (!cachedS3Client) {
    cachedS3Client = createS3Client()
  }

  return cachedS3Client
}

function getStoredName(file: Express.Multer.File) {
  if (typeof file.filename === 'string' && file.filename.length > 0) {
    return path.basename(file.filename)
  }

  const suffix = `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`
  return `${suffix}${path.extname(file.originalname)}`
}

function getObjectKey(storedName: string) {
  return `uploads/${storedName}`
}

function buildPublicUrl(objectKey: string) {
  const base = env.SPACES_CDN_BASE_URL.trim().replace(/\/+$/, '')
  if (base.length > 0) {
    return `${base}/${objectKey}`
  }

  return `https://${env.SPACES_BUCKET}.${env.SPACES_REGION}.digitaloceanspaces.com/${objectKey}`
}

function cleanupTempFile(file: Express.Multer.File) {
  if (typeof file.path === 'string' && file.path.length > 0) {
    fs.rmSync(file.path, { force: true })
  }
}

function readFileBody(file: Express.Multer.File): Buffer {
  if (Buffer.isBuffer(file.buffer) && file.buffer.length > 0) {
    return file.buffer
  }

  if (typeof file.path === 'string' && file.path.length > 0) {
    return fs.readFileSync(file.path)
  }

  throw new Error('Uploaded file body is missing.')
}

function resolveObjectKey(upload: UploadRecord) {
  if (upload.path.startsWith('http://') || upload.path.startsWith('https://')) {
    try {
      const parsed = new URL(upload.path)
      const key = parsed.pathname.replace(/^\/+/, '')
      if (key.length > 0) {
        return key
      }
    } catch {
      // Fall through to best-effort fallbacks.
    }
  }

  if (upload.path.startsWith('/uploads/')) {
    return upload.path.replace(/^\/+/, '')
  }

  return getObjectKey(path.basename(upload.storedName))
}

async function saveToS3(file: Express.Multer.File, storedName: string): Promise<SavedUpload> {
  const objectKey = getObjectKey(storedName)

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: env.SPACES_BUCKET,
      Key: objectKey,
      Body: readFileBody(file),
      ContentType: file.mimetype,
      ACL: 'public-read',
    }),
  )

  cleanupTempFile(file)

  return {
    storedName,
    publicPath: buildPublicUrl(objectKey),
  }
}

async function saveToVercelBlob(file: Express.Multer.File, storedName: string): Promise<SavedUpload> {
  const blob = await put(getObjectKey(storedName), readFileBody(file), {
    access: 'public',
    addRandomSuffix: false,
    contentType: file.mimetype,
    token: env.BLOB_READ_WRITE_TOKEN,
  })

  cleanupTempFile(file)

  return {
    storedName,
    publicPath: blob.url,
  }
}

export async function saveUploadedFile(file: Express.Multer.File): Promise<SavedUpload> {
  const storedName = getStoredName(file)

  if (env.UPLOAD_STORAGE === 'disabled') {
    throw new AppError(
      503,
      'STORAGE_NOT_CONFIGURED',
      'File uploads are disabled until UPLOAD_STORAGE is fully configured.',
    )
  }

  if (env.UPLOAD_STORAGE === 's3') {
    return saveToS3(file, storedName)
  }

  if (env.UPLOAD_STORAGE === 'vercel-blob') {
    return saveToVercelBlob(file, storedName)
  }

  return {
    storedName,
    publicPath: `/uploads/${storedName}`,
  }
}

export async function deleteUploadedFile(upload: UploadRecord) {
  if (env.UPLOAD_STORAGE === 'disabled') {
    return
  }

  if (env.UPLOAD_STORAGE === 's3') {
    const key = resolveObjectKey(upload)
    await getS3Client().send(
      new DeleteObjectCommand({
        Bucket: env.SPACES_BUCKET,
        Key: key,
      }),
    )
    return
  }

  if (env.UPLOAD_STORAGE === 'vercel-blob') {
    const url = upload.path.startsWith('http://') || upload.path.startsWith('https://') ? upload.path : undefined
    if (url) {
      await del(url, { token: env.BLOB_READ_WRITE_TOKEN })
    }
    return
  }

  const absolutePath = path.resolve(env.uploadDirAbsolute, path.basename(upload.storedName))
  fs.rmSync(absolutePath, { force: true })
}

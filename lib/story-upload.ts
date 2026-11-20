import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { put } from '@vercel/blob'

const maxBytes = 8 * 1024 * 1024
const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function saveStoryPoster(file: File) {
  if (!allowed.has(file.type)) throw new Error('type')
  if (file.size <= 0 || file.size > maxBytes) throw new Error('size')

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : file.type === 'image/gif' ? 'gif' : 'jpg'
  const filename = `story-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`storytelling/${filename}`, file, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN })
    return blob.url
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', 'storytelling')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()))
  return `/uploads/storytelling/${filename}`
}

import { supabase, getSupabaseErrorMessage } from '@/lib/supabase'
import { compressImageFile } from '@/lib/compressImage'

export type StorageBucket = 'product-images' | 'product-videos' | 'category-images'
export type ImageStorageBucket = Exclude<StorageBucket, 'product-videos'>

const VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'])

const IMAGE_COMPRESS_OPTIONS: Record<
  ImageStorageBucket,
  { maxWidth: number; maxHeight: number; quality: number; format: 'image/webp' }
> = {
  'product-images': { maxWidth: 1600, maxHeight: 1600, quality: 0.82, format: 'image/webp' },
  'category-images': { maxWidth: 1200, maxHeight: 1200, quality: 0.82, format: 'image/webp' },
}

export async function uploadImage(
  bucket: ImageStorageBucket,
  file: File,
  path?: string,
): Promise<{ url: string | null; error: string | null }> {
  try {
    const compressed = await compressImageFile(file, IMAGE_COMPRESS_OPTIONS[bucket])
    const fileExt = compressed.type === 'image/webp' ? 'webp' : compressed.name.split('.').pop() || 'jpg'
    const fileName = path || `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, compressed, {
      cacheControl: '31536000',
      upsert: true,
      contentType: compressed.type,
    })

    if (uploadError) {
      return { url: null, error: getSupabaseErrorMessage(uploadError) }
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return { url: data.publicUrl, error: null }
  } catch (error) {
    return { url: null, error: getSupabaseErrorMessage(error) }
  }
}

export async function uploadVideo(
  bucket: 'product-videos',
  file: File,
  path?: string,
): Promise<{ url: string | null; error: string | null }> {
  if (!VIDEO_MIME_TYPES.has(file.type)) {
    return { url: null, error: 'Please select an MP4, WebM, or MOV video file' }
  }

  const fileExt = file.name.split('.').pop() || 'mp4'
  const fileName = path || `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '31536000',
    upsert: true,
    contentType: file.type,
  })

  if (uploadError) {
    return { url: null, error: getSupabaseErrorMessage(uploadError) }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { url: data.publicUrl, error: null }
}

export async function deleteImage(
  bucket: StorageBucket,
  path: string,
): Promise<{ error: string | null }> {
  const fileName = path.split('/').pop()
  if (!fileName) return { error: 'Invalid file path' }

  const { error } = await supabase.storage.from(bucket).remove([fileName])
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

export function getStoragePathFromUrl(url: string, bucket: StorageBucket): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return url.slice(index + marker.length)
}

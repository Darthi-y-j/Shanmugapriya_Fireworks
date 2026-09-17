export interface CompressImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  /** Output format — WebP gives best size; JPEG for broader compatibility */
  format?: 'image/webp' | 'image/jpeg'
}

const DEFAULT_OPTIONS: Required<CompressImageOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  format: 'image/webp',
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image file'))
    }
    img.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Image compression failed'))
      },
      type,
      quality,
    )
  })
}

/** Resize & re-encode images in the browser before upload to Supabase storage. */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  const { maxWidth, maxHeight, quality, format } = { ...DEFAULT_OPTIONS, ...options }

  // Skip tiny files that are already efficient
  if (file.size < 180_000 && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
    return file
  }

  const img = await loadImage(file)
  const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height)
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.drawImage(img, 0, 0, width, height)
  const blob = await canvasToBlob(canvas, format, quality)

  const ext = format === 'image/webp' ? 'webp' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
  return new File([blob], `${baseName}.${ext}`, { type: format, lastModified: Date.now() })
}

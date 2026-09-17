import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadImage, type ImageStorageBucket } from '@/services/storage'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  bucket: ImageStorageBucket
  currentUrl?: string | null
  onUpload: (url: string) => void
  onRemove?: () => void
  className?: string
  label?: string
}

export function ImageUploader({
  bucket,
  currentUrl,
  onUpload,
  onRemove,
  className,
  label = 'Upload Image',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 12 * 1024 * 1024) {
      setError('Image must be less than 12MB')
      return
    }

    setUploading(true)
    setError(null)

    const { url, error: uploadError } = await uploadImage(bucket, file)

    if (uploadError || !url) {
      setError(uploadError || 'Upload failed')
    } else {
      onUpload(url)
    }

    setUploading(false)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      {currentUrl ? (
        <div className="relative inline-block">
          <img src={currentUrl} alt="Preview" className="h-32 w-32 rounded-lg border object-cover" />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full max-w-xs flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-500 transition hover:border-slate-400 hover:text-slate-600"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <Upload className="h-8 w-8" />
              <span className="mt-2 text-sm">Click to upload</span>
              <span className="mt-1 text-[10px] text-slate-400">Auto-compressed to WebP</span>
            </>
          )}
        </button>
      )}

      {currentUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-sm text-festive-500 hover:underline"
        >
          Change image
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}

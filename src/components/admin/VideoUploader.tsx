import { useRef, useState } from 'react'
import { Film, Loader2, Upload, X } from 'lucide-react'
import { uploadVideo } from '@/services/storage'
import { cn } from '@/lib/utils'

interface VideoUploaderProps {
  currentUrl?: string | null
  onUpload: (url: string) => void
  onRemove?: () => void
  className?: string
  label?: string
}

const MAX_VIDEO_BYTES = 50 * 1024 * 1024

export function VideoUploader({
  currentUrl,
  onUpload,
  onRemove,
  className,
  label = 'Upload Video',
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file (MP4, WebM, or MOV)')
      return
    }

    if (file.size > MAX_VIDEO_BYTES) {
      setError('Video must be less than 50MB')
      return
    }

    setUploading(true)
    setError(null)

    const { url, error: uploadError } = await uploadVideo('product-videos', file)

    if (uploadError || !url) {
      setError(uploadError || 'Upload failed')
    } else {
      onUpload(url)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <p className="text-xs text-slate-500">MP4, WebM, or MOV — max 50MB. Shown on the product page.</p>

      {currentUrl ? (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-black">
            <video
              src={currentUrl}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full max-w-md object-contain"
            />
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow"
                aria-label="Remove video"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-sm text-festive-500 hover:underline"
          >
            Replace video
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-36 w-full max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-500 transition hover:border-slate-400 hover:text-slate-600"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <Film className="h-8 w-8" />
              <span className="mt-2 flex items-center gap-1.5 text-sm">
                <Upload className="h-4 w-4" />
                Click to upload video
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}

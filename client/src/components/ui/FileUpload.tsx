import { useCallback, useState } from 'react'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface FileUploadProps {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: string
  maxSizeMB?: number
}

export default function FileUpload({ onFiles, accept, multiple = true, label, maxSizeMB = 25 }: FileUploadProps) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    const valid = files.filter((f) => f.size <= maxSizeMB * 1024 * 1024)
    if (valid.length) onFiles(valid)
  }, [onFiles, maxSizeMB])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter((f) => f.size <= maxSizeMB * 1024 * 1024)
    if (valid.length) onFiles(valid)
    e.target.value = ''
  }, [onFiles, maxSizeMB])

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
          dragging ? 'border-forest bg-forest/10' : 'border-smoke hover:border-forest/50'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
          <CloudArrowUpIcon className={clsx('w-10 h-10', dragging ? 'text-forest' : 'text-white/30')} />
          <p className="text-sm text-white/60">
            <span className="text-forest font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-white/30">Max {maxSizeMB}MB per file</p>
        </label>
      </div>
    </div>
  )
}

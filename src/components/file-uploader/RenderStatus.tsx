import { cn } from '@/lib/utils'
import { CloudUploadIcon, ImageIcon, Loader2, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface RenderStatusProps {
  isDragActive: boolean
}

export const RenderEmptyStatus = ({ isDragActive }: RenderStatusProps) => {
  return (
    <div className="text-center">
      <div className="bg-muted mx-auto flex size-12 items-center justify-center rounded-full">
        <CloudUploadIcon className={cn('text-muted-foreground size-6', isDragActive && 'text-primary')} />
      </div>
      <p className="text-muted-foreground text-base font-semibold">
        Drag and drop files here or <span className="text-primary cursor-pointer">click to upload</span>
      </p>
      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  )
}

export const RenderErrorStatus = () => {
  return (
    <div className="text-destructive text-center">
      <div className="bg-destructive/30 mx-auto flex size-12 items-center justify-center rounded-full">
        <ImageIcon className={cn('text-destructive size-6')} />
      </div>
      <p className="mt-2 text-base font-semibold">Upload failed. Please try again.</p>
      <p className="text-muted-foreground mt-2 text-xs font-semibold">
        <span className="font-bold">Note:</span> Only JPG, PNG, and PDF files are allowed.
      </p>
      <Button type="button" className="mt-4" variant="destructive">
        Retry File Selection
      </Button>
    </div>
  )
}

export const RenderUploadedStatus = ({
  previewUrl,
  isDeleting,
  handleDeleteFile,
}: {
  previewUrl: string
  isDeleting: boolean
  handleDeleteFile: () => void
}) => {
  return (
    <div>
      <Image src={previewUrl} alt="uploaded file" fill className="object-contain p-2" />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className={cn('absolute top-4 right-4')}
        onClick={handleDeleteFile}
        disabled={isDeleting}>
        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <TrashIcon className="size-4" />}
      </Button>
    </div>
  )
}

export const RenderUploadingStatus = ({ progress, file }: { progress: number; file: File }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p>{progress}</p>
      <p className="text-foreground mt-2 text-sm font-medium">Uploading...</p>
      <p className="text-muted-foreground mt-1 max-w-xs truncate text-xs">{file.name}</p>
    </div>
  )
}

'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { RenderEmptyStatus, RenderErrorStatus, RenderUploadedStatus, RenderUploadingStatus } from './RenderStatus'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'

interface UploaderState {
  id: string | null
  file: File | null
  uploading: boolean
  progress: number
  key?: string
  isDeleting: boolean
  error: boolean
  objectUrl?: string
  fileType: 'image' | 'video'
}

interface UploaderProps {
  onChange?: (value: string) => void
  value?: string
}

const Uploader = ({ onChange, value }: UploaderProps) => {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: 'image',
    key: value,
  })

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
      objectUrl: URL.createObjectURL(file),
      error: false,
      isDeleting: false,
      fileType: 'image',
    }))

    try {
      // 1. Get presigned url
      const response = await fetch('/api/s3/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      })

      if (!response.ok) {
        toast.error('Failed to get presigned url')
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }))
        return
      }

      const { presignedUrl, key } = await response.json()

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setFileState((prev) => ({
              ...prev,
              progress: progress,
            }))
          }
        }
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              key: key,
            }))

            onChange?.(key)

            toast.success('File uploaded successfully')
            resolve(true)
          } else {
            reject(new Error('Failed to upload file'))
          }
        }
        xhr.onerror = () => {
          reject(new Error('Failed to upload file'))
        }
        xhr.open('PUT', presignedUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })
    } catch {
      toast.error('Failed to upload file')
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }))
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

        // Revoke the old object url if it exists
        if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
          URL.revokeObjectURL(fileState.objectUrl)
        }

        setFileState({
          id: nanoid(),
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          isDeleting: false,
          fileType: 'image',
        })
        uploadFile(file)
      }
    },
    [fileState.objectUrl],
  )

  async function handleDeleteFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return

    setFileState((prev) => ({
      ...prev,
      isDeleting: true,
    }))

    try {
      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: fileState.key }),
      })

      if (!response.ok) {
        toast.error('Failed to delete file')
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }))
        return
      }

      // Revoke the old object url if it exists
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl)
      }

      onChange?.('')

      setFileState({
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        objectUrl: undefined,
        fileType: 'image',
      })

      toast.success('File deleted successfully')
    } catch {
      toast.error('Failed to delete file')
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }))
    }
  }

  function rejectedFiles(fileRejections: FileRejection[]) {
    if (fileRejections.length > 0) {
      const tooManyFiles = fileRejections.find((rejection) => {
        return rejection.errors[0].code === 'too-many-files'
      })
      const fileSizeTooLarge = fileRejections.find((rejection) => {
        return rejection.errors[0].code === 'file-too-large'
      })

      if (tooManyFiles) {
        toast.error('You can only upload one file at a time.')
      }

      if (fileSizeTooLarge) {
        toast.error('File size is too large.')
      }
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return <RenderUploadingStatus progress={fileState.progress} file={fileState.file!} />
    }

    if (fileState.error) {
      return <RenderErrorStatus />
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedStatus
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleDeleteFile={handleDeleteFile}
        />
      )
    }

    return <RenderEmptyStatus isDragActive={isDragActive} />
  }

  useEffect(() => {
    return () => {
      // Revoke the old object url if it exists
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl)
      }
    }
  }, [fileState.objectUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 1024 * 1024 * 5, // 5MB
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  })

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'dark:bg-input/30 relative h-64 w-full border border-dashed transition-colors duration-200 ease-in-out',
        isDragActive ? 'border-primary bg-primary/10 border-solid' : 'border-border hover:border-primary/50',
      )}>
      <CardContent className="flex h-full w-full items-center justify-center">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default Uploader

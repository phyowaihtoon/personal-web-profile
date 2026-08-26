import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { useAuth } from '../../app/providers/auth-provider'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { StatusView } from '../../components/ui/status-view'
import { adminApi } from '../../lib/api/admin'

export function UploadsPage() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const uploadsQuery = useQuery({
    enabled: Boolean(accessToken),
    queryKey: ['admin-uploads'],
    queryFn: () => adminApi.listUploads(accessToken ?? ''),
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => adminApi.uploadFile(accessToken ?? '', file),
    onSuccess: async () => {
      setSelectedFile(null)
      setErrorMessage(null)
      await queryClient.invalidateQueries({ queryKey: ['admin-uploads'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminApi.deleteUpload(accessToken ?? '', id),
    onSuccess: async () => {
      setErrorMessage(null)
      await queryClient.invalidateQueries({ queryKey: ['admin-uploads'] })
    },
  })

  if (uploadsQuery.isLoading) {
    return <StatusView title="Loading uploads" message="Fetching stored media files from the API." />
  }

  if (uploadsQuery.isError || !uploadsQuery.data) {
    return <StatusView title="Unable to load uploads" message="Check the API connection and session state." />
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">Uploads</p>
        <h1 className="mt-2 text-2xl font-semibold">Local media library</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Upload images or documents for content association.</p>
      </div>

      <Card className="space-y-4">
        <Input type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        <Button
          type="button"
          disabled={!selectedFile || uploadMutation.isPending}
          onClick={async () => {
            if (!selectedFile) {
              return
            }

            try {
              await uploadMutation.mutateAsync(selectedFile)
            } catch (error) {
              setErrorMessage(error instanceof Error ? error.message : 'Unable to upload the selected file.')
            }
          }}
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload file'}
        </Button>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {uploadsQuery.data.map((upload) => {
          const uploadPath = String(upload.path ?? '')
          const openHref =
            uploadPath.startsWith('http://') || uploadPath.startsWith('https://')
              ? uploadPath
              : uploadPath.startsWith('/')
                ? uploadPath
                : `/${uploadPath}`

          return (
            <Card key={String(upload.id)}>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{String(upload.kind ?? 'file')}</p>
              <h2 className="mt-3 text-xl font-semibold">{String(upload.originalName ?? upload.storedName ?? upload.id)}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{String(upload.path ?? '')}</p>
              <div className="mt-4 flex gap-3">
                <a href={openHref} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[var(--accent)]">
                  Open file
                </a>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await deleteMutation.mutateAsync(String(upload.id))
                    } catch (error) {
                      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete the selected file.')
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useAuth } from '../../app/providers/auth-provider'
import { Button } from '../../components/ui/button'
import { StatusView } from '../../components/ui/status-view'
import { VisualRecordForm } from '../../features/cms/components/visual-record-form'
import { cloneRecord, toSavePayload } from '../../features/cms/path'
import type { CmsSchema } from '../../features/cms/types'

type Props = {
  title: string
  description: string
  queryKey: string
  schema: CmsSchema
  load: (token: string) => Promise<unknown>
  mode: 'singleton' | 'collection'
  save?: (token: string, body: Record<string, unknown>) => Promise<unknown>
  create?: (token: string, body: Record<string, unknown>) => Promise<unknown>
  update?: (token: string, id: string, body: Record<string, unknown>) => Promise<unknown>
  remove?: (token: string, id: string) => Promise<unknown>
  createTemplate?: Record<string, unknown>
}

export function CmsEditorPage({
  title,
  description,
  queryKey,
  schema,
  load,
  mode,
  save,
  create,
  update,
  remove,
  createTemplate = {},
}: Props) {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  const query = useQuery({
    enabled: Boolean(accessToken),
    queryKey: [queryKey],
    queryFn: () => load(accessToken ?? ''),
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [singletonDraft, setSingletonDraft] = useState<Record<string, unknown>>({})
  const [itemDrafts, setItemDrafts] = useState<Record<string, Record<string, unknown>>>({})

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => save?.(accessToken ?? '', payload),
    onSuccess: async () => {
      setErrorMessage(null)
      await queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => create?.(accessToken ?? '', payload),
    onSuccess: async () => {
      setErrorMessage(null)
      await queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      update?.(accessToken ?? '', id, payload),
    onSuccess: async () => {
      setErrorMessage(null)
      await queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => remove?.(accessToken ?? '', id),
    onSuccess: async () => {
      setErrorMessage(null)
      await queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  const collectionItems = Array.isArray(query.data) ? (query.data as Array<Record<string, unknown>>) : []

  useEffect(() => {
    if (mode === 'singleton' && query.data && typeof query.data === 'object' && !Array.isArray(query.data)) {
      setSingletonDraft(cloneRecord(query.data as Record<string, unknown>))
    }
  }, [mode, query.data])

  useEffect(() => {
    if (mode !== 'collection' || !Array.isArray(query.data)) {
      return
    }

    const next: Record<string, Record<string, unknown>> = {}
    ;(query.data as Array<Record<string, unknown>>).forEach((item, index) => {
      next[String(item.id ?? `new-${index}`)] = cloneRecord(item)
    })
    setItemDrafts(next)
  }, [mode, query.data])

  if (query.isLoading) {
    return <StatusView title={`Loading ${title}`} message="Fetching the latest CMS data." />
  }

  if (query.isError) {
    return <StatusView title={`Unable to load ${title}`} message="The API did not return a successful response." />
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">Content module</p>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{description}</p>
      </div>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

      {mode === 'singleton' ? (
        <VisualRecordForm
          schema={schema}
          value={singletonDraft}
          onChange={setSingletonDraft}
          saving={saveMutation.isPending}
          onSave={async () => {
            try {
              setErrorMessage(null)
              await saveMutation.mutateAsync(toSavePayload(singletonDraft))
            } catch (error) {
              setErrorMessage(error instanceof Error ? error.message : 'Unable to save this resource.')
            }
          }}
        />
      ) : (
        <div className="space-y-4">
          <Button
            type="button"
            onClick={async () => {
              try {
                setErrorMessage(null)
                await createMutation.mutateAsync(createTemplate)
              } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Unable to create this record.')
              }
            }}
            disabled={!create || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Add record'}
          </Button>

          {collectionItems.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No records yet. Add one to start editing visually.</p>
          ) : null}

          {collectionItems.map((item, index) => {
            const key = String(item.id ?? `new-${index}`)
            const draft = itemDrafts[key] ?? item
            return (
              <VisualRecordForm
                key={key}
                schema={schema}
                value={draft}
                title={schema.summary?.(draft)}
                saving={updateMutation.isPending}
                deleting={deleteMutation.isPending}
                onChange={(next) =>
                  setItemDrafts((current) => ({
                    ...current,
                    [key]: next,
                  }))
                }
                onSave={async () => {
                  try {
                    setErrorMessage(null)
                    await updateMutation.mutateAsync({ id: key, payload: toSavePayload(draft) })
                  } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Unable to update this record.')
                  }
                }}
                onDelete={
                  remove
                    ? async () => {
                        try {
                          setErrorMessage(null)
                          await deleteMutation.mutateAsync(key)
                          setItemDrafts((current) => {
                            const next = { ...current }
                            delete next[key]
                            return next
                          })
                        } catch (error) {
                          setErrorMessage(error instanceof Error ? error.message : 'Unable to delete this record.')
                        }
                      }
                    : undefined
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

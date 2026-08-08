import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../../app/providers/auth-provider'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { StatusView } from '../../components/ui/status-view'
import { Textarea } from '../../components/ui/textarea'

type Props = {
  title: string
  description: string
  queryKey: string
  load: (token: string) => Promise<unknown>
  mode: 'singleton' | 'collection'
  save?: (token: string, body: Record<string, unknown>) => Promise<unknown>
  create?: (token: string, body: Record<string, unknown>) => Promise<unknown>
  update?: (token: string, id: string, body: Record<string, unknown>) => Promise<unknown>
  remove?: (token: string, id: string) => Promise<unknown>
  createTemplate?: Record<string, unknown>
}

function parseJsonObject(value: string) {
  const parsed = JSON.parse(value) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('JSON value must be an object.')
  }
  return parsed as Record<string, unknown>
}

export function CmsEditorPage({
  title,
  description,
  queryKey,
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
  const [draftText, setDraftText] = useState('')
  const [itemDrafts, setItemDrafts] = useState<Record<string, string>>({})

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

  const singletonJson = useMemo(() => JSON.stringify(query.data ?? {}, null, 2), [query.data])
  const collectionItems = Array.isArray(query.data) ? (query.data as Array<Record<string, unknown>>) : []

  useEffect(() => {
    if (mode === 'singleton' && query.data) {
      setDraftText(singletonJson)
    }
  }, [mode, query.data, singletonJson])

  useEffect(() => {
    if (mode === 'collection' && query.data) {
      const next: Record<string, string> = {}
      collectionItems.forEach((item, index) => {
        next[String(item.id ?? `new-${index}`)] = JSON.stringify(item, null, 2)
      })
      setItemDrafts(next)
    }
  }, [collectionItems, mode, query.data])

  if (query.isLoading) {
    return <StatusView title={`Loading ${title}`} message="Fetching the latest CMS data." />
  }

  if (query.isError) {
    return <StatusView title={`Unable to load ${title}`} message="The API did not return a successful response." />
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Content module</p>
        <h1 className="display-title mt-3 text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{description}</p>
      </div>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

      {mode === 'singleton' ? (
        <Card className="space-y-4 bg-[var(--surface-strong)]">
          <Textarea className="min-h-[26rem] font-mono text-xs" value={draftText || singletonJson} onChange={(event) => setDraftText(event.target.value)} />
          <Button
            type="button"
            onClick={async () => {
              try {
                setErrorMessage(null)
                await saveMutation.mutateAsync(parseJsonObject(draftText || singletonJson))
              } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Unable to save this resource.')
              }
            }}
            disabled={!save || saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <Button
            type="button"
            onClick={async () => {
              try {
                setErrorMessage(null)
                await createMutation.mutateAsync(createTemplate)
                setItemDrafts({})
              } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Unable to create this record.')
              }
            }}
            disabled={!create || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Add record'}
          </Button>

          {collectionItems.map((item, index) => {
            const key = String(item.id ?? `new-${index}`)
            return (
              <Card key={key} className="space-y-4 bg-[var(--surface-strong)]">
                <Textarea
                  className="min-h-[18rem] font-mono text-xs"
                  value={itemDrafts[key] ?? JSON.stringify(item, null, 2)}
                  onChange={(event) =>
                    setItemDrafts((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        setErrorMessage(null)
                        await updateMutation.mutateAsync({ id: key, payload: parseJsonObject(itemDrafts[key] ?? JSON.stringify(item, null, 2)) })
                      } catch (error) {
                        setErrorMessage(error instanceof Error ? error.message : 'Unable to update this record.')
                      }
                    }}
                    disabled={!update || updateMutation.isPending}
                  >
                    Save record
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
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
                    }}
                    disabled={!remove || deleteMutation.isPending}
                  >
                    Delete record
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
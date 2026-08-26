import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { CmsFieldList } from './cms-field-list'
import type { CmsSchema } from '../types'

type Props = {
  schema: CmsSchema
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  onSave: () => void
  onDelete?: () => void
  saving?: boolean
  deleting?: boolean
  title?: string
}

export function VisualRecordForm({
  schema,
  value,
  onChange,
  onSave,
  onDelete,
  saving,
  deleting,
  title,
}: Props) {
  const heading = title ?? schema.summary?.(value) ?? 'Record'

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">Visual editor</p>
          <h2 className="mt-2 text-xl font-semibold">{heading}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
          {onDelete ? (
            <Button type="button" variant="secondary" onClick={onDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          ) : null}
        </div>
      </div>
      <CmsFieldList fields={schema.fields} value={value} onChange={onChange} />
    </Card>
  )
}

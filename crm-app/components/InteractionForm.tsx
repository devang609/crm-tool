'use client'

import { Interaction } from '@/lib/types'
import { useState } from 'react'

export function InteractionForm({
  onSubmit,
  onCancel,
  loading = false,
}: {
  onSubmit: (data: Partial<Interaction>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}) {
  const [formData, setFormData] = useState({
    type: 'note' as 'call' | 'email' | 'meeting' | 'note',
    summary: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.summary) {
      setError('Summary is required')
      return
    }

    try {
      await onSubmit(formData)
      setFormData({ type: 'note', summary: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="error bg-red-50 p-3 rounded">{error}</div>}

      <div>
        <label className="label">Type *</label>
        <select
          className="input"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
        >
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="note">Note</option>
        </select>
      </div>

      <div>
        <label className="label">Summary *</label>
        <textarea
          className="input"
          rows={3}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1">
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}

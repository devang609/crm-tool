'use client'

import { Profile, UserRole } from '@/lib/types'
import { useState } from 'react'

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  isCreating = true,
}: {
  initialData?: Profile
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  loading?: boolean
  isCreating?: boolean
}) {
  const [formData, setFormData] = useState<any>(
    initialData || {
      full_name: '',
      email: '',
      password: '',
      role: 'EMPLOYEE' as UserRole,
    }
  )
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.full_name) {
      setError('Full name is required')
      return
    }

    if (!formData.email) {
      setError('Email is required')
      return
    }

    if (isCreating && !formData.password) {
      setError('Password is required')
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="error bg-red-50 p-3 rounded">{error}</div>}

      <div>
        <label className="label">Full Name *</label>
        <input
          type="text"
          className="input"
          value={formData.full_name || ''}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="label">Email *</label>
        <input
          type="email"
          className="input"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={!isCreating}
          required
        />
      </div>

      {isCreating && (
        <div>
          <label className="label">Password *</label>
          <input
            type="password"
            className="input"
            value={formData.password || ''}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      )}

      <div>
        <label className="label">Role</label>
        <select
          className="input"
          value={formData.role || 'EMPLOYEE'}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
        >
          <option value="ADMIN">Admin</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="CLIENT">Client</option>
        </select>
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

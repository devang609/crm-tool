'use client'

import { Customer } from '@/lib/types'
import { useState } from 'react'

export function CustomerForm({
  initialData,
  employees,
  onSubmit,
  onCancel,
  loading = false,
  isEmployee = false,
}: {
  initialData?: Customer
  employees: Array<{ id: string; full_name: string }>
  onSubmit: (data: Partial<Customer>) => Promise<void>
  onCancel: () => void
  loading?: boolean
  isEmployee?: boolean
}) {
  const [formData, setFormData] = useState<Partial<Customer>>(
    initialData || {
      full_name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
      notes: '',
      assigned_to: '',
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
        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Phone</label>
        <input
          type="tel"
          className="input"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Company</label>
        <input
          type="text"
          className="input"
          value={formData.company || ''}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Status</label>
        <select
          className="input"
          value={formData.status || 'lead'}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
        >
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {!isEmployee && (
        <div>
          <label className="label">Assign To</label>
          <select
            className="input"
            value={formData.assigned_to || ''}
            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
          >
            <option value="">None</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="label">Notes</label>
        <textarea
          className="input"
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

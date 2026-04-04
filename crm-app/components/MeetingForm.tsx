'use client'

import { Meeting, Profile } from '@/lib/types'
import { useState } from 'react'

export function MeetingForm({
  initialData,
  employees,
  onSubmit,
  onCancel,
  loading = false,
}: {
  initialData?: Meeting
  employees: Profile[]
  onSubmit: (data: Partial<Meeting> & { attendee_ids?: string[] }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}) {
  const [formData, setFormData] = useState<
    Partial<Meeting> & { attendee_ids?: string[] }
  >(
    initialData || {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      meeting_link: '',
      attendee_ids: [],
    }
  )
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title) {
      setError('Title is required')
      return
    }

    if (!formData.start_time || !formData.end_time) {
      setError('Start and end time are required')
      return
    }

    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      setError('End time must be after start time')
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
        <label className="label">Meeting Title *</label>
        <input
          type="text"
          className="input"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          className="input"
          rows={3}
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label className="label">Start Time *</label>
        <input
          type="datetime-local"
          className="input"
          value={
            formData.start_time
              ? new Date(formData.start_time).toISOString().slice(0, 16)
              : ''
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              start_time: new Date(e.target.value).toISOString(),
            })
          }
          required
        />
      </div>

      <div>
        <label className="label">End Time *</label>
        <input
          type="datetime-local"
          className="input"
          value={
            formData.end_time
              ? new Date(formData.end_time).toISOString().slice(0, 16)
              : ''
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              end_time: new Date(e.target.value).toISOString(),
            })
          }
          required
        />
      </div>

      <div>
        <label className="label">Meeting Link (optional)</label>
        <input
          type="url"
          className="input"
          value={formData.meeting_link || ''}
          onChange={(e) =>
            setFormData({ ...formData, meeting_link: e.target.value })
          }
          placeholder="https://meet.google.com/..."
        />
      </div>

      <div>
        <label className="label">Add Attendees</label>
        <div className="space-y-2">
          {employees.map((emp) => (
            <div key={emp.id} className="flex items-center">
              <input
                type="checkbox"
                id={emp.id}
                checked={
                  formData.attendee_ids?.includes(emp.id) || false
                }
                onChange={(e) => {
                  const ids = formData.attendee_ids || []
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      attendee_ids: [...ids, emp.id],
                    })
                  } else {
                    setFormData({
                      ...formData,
                      attendee_ids: ids.filter((id) => id !== emp.id),
                    })
                  }
                }}
              />
              <label htmlFor={emp.id} className="ml-2 cursor-pointer">
                {emp.full_name} ({emp.email})
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1">
          {loading ? 'Saving...' : 'Save Meeting'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}

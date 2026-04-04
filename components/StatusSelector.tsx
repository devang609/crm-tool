'use client'

import { Customer } from '@/lib/types'
import { useState } from 'react'

export function StatusSelector({
  customer,
  onStatusChange,
  loading = false,
  isAssigned = true,
}: {
  customer: Customer
  onStatusChange: (status: string) => Promise<void>
  loading?: boolean
  isAssigned?: boolean
}) {
  const [error, setError] = useState('')

  const handleStatusChange = async (newStatus: string) => {
    try {
      setError('')
      await onStatusChange(newStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  if (!isAssigned) {
    return (
      <div>
        <p className="text-gray-600 text-sm">Status</p>
        <p className="text-lg font-medium capitalize">{customer.status}</p>
        <p className="text-xs text-gray-400 mt-2">You are not assigned to this customer</p>
      </div>
    )
  }

  return (
    <div>
      {error && <div className="error bg-red-50 p-2 rounded mb-2 text-sm">{error}</div>}
      <p className="text-gray-600 text-sm mb-2">Status</p>
      <div className="flex flex-wrap gap-2">
        {['LEAD', 'IN_PROGRESS', 'CONVERTED', 'INACTIVE'].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={loading || customer.status === status}
            className={`px-3 py-2 rounded text-sm font-medium transition ${
              customer.status === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            {status === 'LEAD' && 'Fresh Lead'}
            {status === 'IN_PROGRESS' && 'In Progress'}
            {status === 'CONVERTED' && 'Converted'}
            {status === 'INACTIVE' && 'Inactive'}
          </button>
        ))}
      </div>
    </div>
  )
}

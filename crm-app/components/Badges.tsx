'use client'

import { UserRole } from '@/lib/types'

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    LEAD: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    CONVERTED: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
  }

  const labels: Record<string, string> = {
    LEAD: 'Fresh Lead',
    IN_PROGRESS: 'In Progress',
    CONVERTED: 'Converted',
    INACTIVE: 'Inactive',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.LEAD}`}>
      {labels[status] || status}
    </span>
  )
}

export function RoleBadge({ role }: { role: UserRole }) {
  const colors: Record<UserRole, string> = {
    ADMIN: 'bg-red-100 text-red-800',
    EMPLOYEE: 'bg-blue-100 text-blue-800',
    CLIENT: 'bg-green-100 text-green-800',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[role]}`}>
      {role}
    </span>
  )
}

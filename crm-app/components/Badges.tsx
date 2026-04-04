'use client'

import { UserRole } from '@/lib/types'

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    lead: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
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

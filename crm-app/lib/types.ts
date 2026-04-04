// User roles
export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'CLIENT'

// User profile
export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  created_at: string
}

// Customer
export interface Customer {
  id: string
  full_name: string
  email?: string
  phone?: string
  company?: string
  status: 'active' | 'inactive' | 'lead'
  notes?: string
  assigned_to?: string
  created_by?: string
  created_at: string
  updated_at: string
}

// Interaction
export interface Interaction {
  id: string
  customer_id: string
  employee_id?: string
  type: 'call' | 'email' | 'meeting' | 'note'
  summary: string
  created_at: string
}

// API Response structure
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Auth context
export interface AuthContextType {
  user: Profile | null
  loading: boolean
  logout: () => Promise<void>
}

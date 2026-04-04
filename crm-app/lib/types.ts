// User roles
export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'CLIENT'

// Customer status - represents the sales pipeline stage
export type CustomerStatus = 'LEAD' | 'IN_PROGRESS' | 'CONVERTED' | 'INACTIVE'

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
  status: CustomerStatus
  notes?: string
  assigned_to?: string
  created_by?: string
  created_at: string
  updated_at: string
}

// Meeting/Calendar Event
export interface Meeting {
  id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  meeting_link?: string
  organized_by: string
  created_at: string
  updated_at: string
}

// Meeting Attendee
export interface MeetingAttendee {
  id: string
  meeting_id: string
  attendee_id: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
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

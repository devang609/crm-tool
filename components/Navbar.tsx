'use client'

import { Profile } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Navbar({ user }: { user: Profile | null }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          CRM
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex gap-4">
              {user.role === 'ADMIN' && (
                <>
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                  <Link href="/admin/users" className="text-gray-700 hover:text-blue-600">
                    Users
                  </Link>
                  <Link href="/admin/customers" className="text-gray-700 hover:text-blue-600">
                    Customers
                  </Link>
                </>
              )}
              {(user.role === 'EMPLOYEE' || user.role === 'ADMIN') && (
                <>
                  <Link href="/employee" className="text-gray-700 hover:text-blue-600">
                    My Customers
                  </Link>
                  <Link href="/calendar" className="text-gray-700 hover:text-blue-600">
                    Calendar
                  </Link>
                </>
              )}
              {user.role === 'CLIENT' && (
                <Link href="/client" className="text-gray-700 hover:text-blue-600">
                  My Profile
                </Link>
              )}
            </div>

            <div className="text-right">
              <p className="font-medium">{user.full_name}</p>
              <p className="text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {user.role}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

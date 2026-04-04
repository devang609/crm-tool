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
          <div className="flex items-center gap-4">
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

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { StatusBadge } from '@/components/Badges'

export default function ClientPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await supabase.auth.getSession()
        if (session.data.session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.data.session.user.id)
            .single()
          setUser(profile)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <><Navbar user={user} /><div className="container py-8">Loading...</div></>

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        {user && (
          <div className="card max-w-md">
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="text-lg font-medium">{user.full_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Role</p>
                <p className="text-lg font-medium"><StatusBadge status={user.role} /></p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Joined</p>
                <p className="text-lg font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

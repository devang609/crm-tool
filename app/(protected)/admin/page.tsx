'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { BriefingButton } from '@/components/BriefingButton'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState<string>('')
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalEmployees: 0,
    totalClients: 0,
    activeCustomers: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const session = await supabase.auth.getSession()
        console.log('Session:', session)

        if (!session.data.session) {
          setError('No session found')
          router.push('/login')
          return
        }

        const userId = session.data.session.user.id
        console.log('Fetching profile for userId:', userId)

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        console.log('Profile query result:', { profile, profileError })

        if (profileError) {
          setError(`Profile fetch error: ${profileError.message}`)
          return
        }

        if (!profile) {
          setError('Profile not found in database')
          return
        }

        setUser(profile)

        // Check if user is ADMIN
        if (profile.role !== 'ADMIN') {
          console.log('User role is', profile.role, 'not ADMIN')
          setError(`User role is ${profile.role}, not ADMIN`)
          router.push('/unauthorized')
          return
        }

        setAuthorized(true)

        // Get statistics
        const { count: customersCount } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })

        const { count: convertedCount } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'CONVERTED')

        const { count: employeesCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'EMPLOYEE')

        const { count: clientsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'CLIENT')

        setStats({
          totalCustomers: customersCount || 0,
          totalEmployees: employeesCount || 0,
          totalClients: clientsCount || 0,
          activeCustomers: convertedCount || 0,
        })
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(`Unexpected error: ${err}`)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) return <div className="container py-8">Loading...</div>
  if (error) return <div className="container py-8"><div className="text-red-600">Error: {error}</div></div>
  if (!authorized) return <div className="container py-8">Checking authorization...</div>

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <BriefingButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm">Total Customers</p>
            <p className="text-3xl font-bold">{stats.totalCustomers}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Active Customers</p>
            <p className="text-3xl font-bold text-green-600">{stats.activeCustomers}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Total Employees</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalEmployees}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Total Clients</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalClients}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/users" className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <p className="text-gray-600">Manage users and assign roles</p>
          </Link>
          <Link href="/admin/customers" className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Customer Management</h3>
            <p className="text-gray-600">View and manage all customers</p>
          </Link>
          <Link href="/employee" className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Employee View</h3>
            <p className="text-gray-600">See employee dashboard</p>
          </Link>
        </div>
      </div>
    </>
  )
}

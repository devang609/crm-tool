'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Profile, Customer } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { BriefingButton } from '@/components/BriefingButton'
import { StatusBadge } from '@/components/Badges'
import { Table, TableColumn } from '@/components/Table'
import Link from 'next/link'

export default function EmployeePage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
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

          const { data: custs } = await supabase
            .from('customers')
            .select('*')
            .eq('assigned_to', session.data.session.user.id)
            .order('created_at', { ascending: false })
          setCustomers(custs || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const columns: TableColumn<Customer>[] = [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id',
      label: 'Actions',
      render: (v) => (
        <Link href={`/dashboard/customers/${v}`} className="btn btn-primary text-sm">
          View
        </Link>
      ),
    },
  ]

  if (loading) return <><Navbar user={user} /><div className="container py-8">Loading...</div></>

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Customers</h1>
          <BriefingButton />
        </div>
        <Table columns={columns} data={customers} />
      </div>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Profile, Customer } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { CustomerForm } from '@/components/CustomerForm'
import { StatusBadge } from '@/components/Badges'
import { Table, TableColumn } from '@/components/Table'
import { Modal, ConfirmDialog } from '@/components/Modal'
import Link from 'next/link'

export default function CustomersPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

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
          .order('created_at', { ascending: false })
        setCustomers(custs || [])

        const { data: emps } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'EMPLOYEE')
        setEmployees(emps || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers'
      const method = editingCustomer ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save')

      setShowForm(false)
      setEditingCustomer(null)
      fetchData()
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/customers/${deleteId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      setDeleteId(null)
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const columns: TableColumn<Customer>[] = [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/customers/${value}`} className="btn btn-secondary text-sm">
            View
          </Link>
          <button
            onClick={() => setEditingCustomer(customers.find(c => c.id === value) || null)}
            className="btn btn-secondary text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteId(value)}
            className="btn btn-danger text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  if (loading) return <><Navbar user={user} /><div className="container py-8">Loading...</div></>

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Customers</h1>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Add Customer
          </button>
        </div>

        <Table columns={columns} data={customers} />

        <Modal
          isOpen={showForm || !!editingCustomer}
          onClose={() => { setShowForm(false); setEditingCustomer(null) }}
          title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
        >
          <CustomerForm
            initialData={editingCustomer || undefined}
            employees={employees}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingCustomer(null) }}
          />
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteId}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          title="Delete Customer"
          message="Are you sure?"
          isDangerous
        />
      </div>
    </>
  )
}

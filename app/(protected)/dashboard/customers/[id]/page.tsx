'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Profile, Customer, Interaction } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { InteractionForm } from '@/components/InteractionForm'
import { CustomerForm } from '@/components/CustomerForm'
import { StatusSelector } from '@/components/StatusSelector'
import { Modal } from '@/components/Modal'
import { useRouter } from 'next/navigation'

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [employees, setEmployees] = useState<Array<{ id: string; full_name: string }>>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [params.id])

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

        const { data: cust } = await supabase
          .from('customers')
          .select('*')
          .eq('id', params.id)
          .single()
        setCustomer(cust)

        const { data: ints } = await supabase
          .from('interactions')
          .select('*')
          .eq('customer_id', params.id)
          .order('created_at', { ascending: false })
        setInteractions(ints || [])

        // Fetch employees for assignment dropdown
        const { data: emps } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'EMPLOYEE')
        setEmployees(emps || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddInteraction = async (data: any) => {
    try {
      const response = await fetch(`/api/customers/${params.id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to add interaction')

      setShowForm(false)
      fetchData()
    } catch (error) {
      throw error
    }
  }

  const handleEditCustomer = async (data: Partial<Customer>) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/customers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update customer')

      setEditMode(false)
      fetchData()
    } catch (error) {
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/customers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      fetchData()
    } catch (error) {
      throw error
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <><Navbar user={user} /><div className="container py-8">Loading...</div></>
  if (!customer) return <><Navbar user={user} /><div className="container py-8">Customer not found</div></>

  if (editMode) {
    return (
      <>
        <Navbar user={user} />
        <div className="container">
          <button onClick={() => router.back()} className="mb-4 text-blue-600">
            ← Back
          </button>
          <div className="card max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit Customer</h1>
            <CustomerForm
              initialData={customer}
              employees={employees}
              onSubmit={handleEditCustomer}
              onCancel={() => setEditMode(false)}
              loading={saving}
              isEmployee={user?.role === 'EMPLOYEE'}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <button onClick={() => router.back()} className="mb-4 text-blue-600">
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold">{customer.full_name}</h1>
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-primary text-sm"
              >
                Edit
              </button>
            </div>
            <div className="space-y-6">
              {customer.email && (
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-lg">{customer.email}</p>
                </div>
              )}
              {customer.phone && (
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="text-lg">{customer.phone}</p>
                </div>
              )}
              {customer.company && (
                <div>
                  <p className="text-gray-600 text-sm">Company</p>
                  <p className="text-lg">{customer.company}</p>
                </div>
              )}
              <div className="border-t pt-4">
                <StatusSelector
                  customer={customer}
                  onStatusChange={handleStatusChange}
                  loading={saving}
                  isAssigned={customer.assigned_to === user?.id}
                />
              </div>
              {customer.notes && (
                <div>
                  <p className="text-gray-600 text-sm">Notes</p>
                  <p>{customer.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Interactions</h2>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Add Interaction
              </button>
            </div>

            <div className="space-y-4">
              {interactions.length === 0 ? (
                <p className="text-gray-600">No interactions yet</p>
              ) : (
                interactions.map((int) => (
                  <div key={int.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-medium capitalize">{int.type}</p>
                    <p className="text-gray-600 text-sm">{int.summary}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(int.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="Add Interaction"
        >
          <InteractionForm
            onSubmit={handleAddInteraction}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      </div>
    </>
  )
}

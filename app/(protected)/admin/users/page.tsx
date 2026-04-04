'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { UserForm } from '@/components/UserForm'
import { RoleBadge } from '@/components/Badges'
import { Table, TableColumn } from '@/components/Table'
import { Modal, ConfirmDialog } from '@/components/Modal'

export default function UsersPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
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

        const { data: usersList } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        setUsers(usersList || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (data: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      setShowForm(false)
      fetchData()
    } catch (error) {
      throw error
    }
  }

  const handleUpdateUser = async (data: any) => {
    try {
      const response = await fetch(`/api/users/${editingUser!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      setEditingUser(null)
      fetchData()
    } catch (error) {
      throw error
    }
  }

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/users/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      setDeleteId(null)
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const columns: TableColumn<Profile>[] = [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => <RoleBadge role={value} />,
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditingUser(row)}
            className="btn btn-secondary text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-danger text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  if (loading) return <div className="container py-8">Loading...</div>

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <button
            onClick={() => {
              setEditingUser(null)
              setShowForm(true)
            }}
            className="btn btn-primary"
          >
            Add User
          </button>
        </div>

        <Table columns={columns} data={users} />

        <Modal
          isOpen={showForm || !!editingUser}
          onClose={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
          title={editingUser ? 'Edit User' : 'Create User'}
        >
          <UserForm
            initialData={editingUser || undefined}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={() => {
              setShowForm(false)
              setEditingUser(null)
            }}
            isCreating={!editingUser}
          />
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteId}
          onConfirm={handleDeleteUser}
          onCancel={() => setDeleteId(null)}
          title="Delete User"
          message="Are you sure you want to delete this user?"
          isDangerous
        />
      </div>
    </>
  )
}

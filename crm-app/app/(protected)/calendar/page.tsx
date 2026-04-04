'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Profile, Meeting } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { MeetingForm } from '@/components/MeetingForm'
import { Modal, ConfirmDialog } from '@/components/Modal'
import Link from 'next/link'

export default function CalendarPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

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

        // Get all employees for attendee selection
        const { data: emps } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'EMPLOYEE')
          .neq('id', session.data.session.user.id)
        setEmployees(emps || [])

        // Get all meetings
        const response = await fetch('/api/meetings')
        const result = await response.json()
        if (result.success) {
          setMeetings(result.data || [])
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create meeting')

      setShowForm(false)
      fetchData()
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/meetings/${deleteId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      setDeleteId(null)
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getMeetingsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    return meetings.filter((m) => {
      const meetingDate = new Date(m.start_time)
        .toISOString()
        .split('T')[0]
      return meetingDate === dateStr
    })
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  if (loading) return <><Navbar user={user} /><div className="container py-8">Loading...</div></>

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Schedule Meeting
          </button>
        </div>

        {/* Calendar Header */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {currentMonth.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                className="btn btn-secondary text-sm"
              >
                ← Previous
              </button>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="btn btn-secondary text-sm"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-bold p-2 bg-gray-100">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="p-2 bg-gray-50"></div>
            ))}
            {days.map((day) => {
              const dayMeetings = getMeetingsForDate(day)
              return (
                <div
                  key={day}
                  className="border p-2 min-h-24 hover:bg-blue-50 cursor-pointer"
                >
                  <p className="font-bold text-sm">{day}</p>
                  <div className="mt-1 space-y-1">
                    {dayMeetings.map((m) => (
                      <Link
                        key={m.id}
                        href={`/calendar/meetings/${m.id}`}
                        className="block text-xs bg-blue-500 text-white p-1 rounded truncate hover:bg-blue-600"
                      >
                        {m.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming meetings list */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Upcoming Meetings</h2>
          {meetings.length === 0 ? (
            <p className="text-gray-600">No meetings scheduled</p>
          ) : (
            <div className="space-y-3">
              {meetings
                .sort(
                  (a, b) =>
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
                )
                .slice(0, 5)
                .map((m) => (
                  <div key={m.id} className="border rounded p-3 flex justify-between items-start">
                    <div>
                      <p className="font-bold">{m.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(m.start_time).toLocaleString()}
                      </p>
                      {m.description && (
                        <p className="text-sm mt-1">{m.description}</p>
                      )}
                      {m.meeting_link && (
                        <a
                          href={m.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm"
                        >
                          Join Meeting →
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/calendar/meetings/${m.id}`} className="btn btn-secondary text-sm">
                        View
                      </Link>
                      {m.organized_by === user?.id && (
                        <button
                          onClick={() => setDeleteId(m.id)}
                          className="btn btn-danger text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="Schedule Meeting"
        >
          <MeetingForm
            employees={employees}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteId}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          title="Delete Meeting"
          message="Are you sure? All attendees will be notified."
          isDangerous
        />
      </div>
    </>
  )
}

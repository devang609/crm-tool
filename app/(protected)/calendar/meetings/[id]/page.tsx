'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Profile, Meeting } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'

interface MeetingWithAttendees extends Meeting {
  meeting_attendees?: Array<{
    id: string
    attendee_id: string
    status: 'pending' | 'accepted' | 'declined'
    profiles: { full_name: string; email: string }
  }>
}

export default function MeetingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [meeting, setMeeting] = useState<MeetingWithAttendees | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

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

        const response = await fetch(`/api/meetings/${params.id}`)
        const result = await response.json()
        if (result.success) {
          setMeeting(result.data)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponseChange = async (
    attendanceId: string,
    status: 'accepted' | 'declined'
  ) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/meetings/attendees/${attendanceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update response')
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <><Navbar user={user} /><div className="container py-8">Loading...</div></>
  if (!meeting)
    return (
      <>
        <Navbar user={user} />
        <div className="container py-8">Meeting not found</div>
      </>
    )

  const userAttendance = meeting.meeting_attendees?.find(
    (a) => a.attendee_id === user?.id
  )

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <button onClick={() => router.back()} className="mb-4 text-blue-600">
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Meeting Details */}
          <div className="md:col-span-2 card">
            <h1 className="text-3xl font-bold mb-6">{meeting.title}</h1>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Start Time</p>
                <p className="text-lg">
                  {new Date(meeting.start_time).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">End Time</p>
                <p className="text-lg">
                  {new Date(meeting.end_time).toLocaleString()}
                </p>
              </div>

              {meeting.description && (
                <div>
                  <p className="text-gray-600 text-sm">Description</p>
                  <p className="text-lg">{meeting.description}</p>
                </div>
              )}

              {meeting.meeting_link && (
                <div>
                  <p className="text-gray-600 text-sm">Meeting Link</p>
                  <a
                    href={meeting.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {meeting.meeting_link}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Attendees */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Attendees</h2>

            {userAttendance && (
              <div className="mb-6 p-3 bg-blue-50 rounded">
                <p className="text-sm font-medium mb-2">Your Response</p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleResponseChange(userAttendance.id, 'accepted')
                    }
                    disabled={updating || userAttendance.status === 'accepted'}
                    className={`btn text-sm flex-1 ${
                      userAttendance.status === 'accepted'
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleResponseChange(userAttendance.id, 'declined')
                    }
                    disabled={updating || userAttendance.status === 'declined'}
                    className={`btn text-sm flex-1 ${
                      userAttendance.status === 'declined'
                        ? 'btn-danger'
                        : 'btn-secondary'
                    }`}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {meeting.meeting_attendees?.map((attendee) => (
                <div
                  key={attendee.id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{attendee.profiles.full_name}</p>
                    <p className="text-sm text-gray-600">
                      {attendee.profiles.email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      attendee.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : attendee.status === 'declined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {attendee.status.charAt(0).toUpperCase() +
                      attendee.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

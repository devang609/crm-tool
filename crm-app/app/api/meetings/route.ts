import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get all meetings (calendar view)
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get all meetings where user is attendee or organizer
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select(`
        *,
        profiles:organized_by (full_name, email)
      `)
      .order('start_time', { ascending: true })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: meetings },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get meetings error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new meeting
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { title, description, start_time, end_time, meeting_link, attendee_ids } =
      await request.json()

    if (!title || !start_time || !end_time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        title,
        description,
        start_time,
        end_time,
        meeting_link,
        organized_by: session.user.id,
      })
      .select()
      .single()

    if (meetingError) {
      return NextResponse.json(
        { success: false, error: meetingError.message },
        { status: 500 }
      )
    }

    // Add organizer as attendee
    await supabase.from('meeting_attendees').insert({
      meeting_id: meeting.id,
      attendee_id: session.user.id,
      status: 'accepted',
    })

    // Add other attendees
    if (attendee_ids && attendee_ids.length > 0) {
      const attendees = attendee_ids.map((id: string) => ({
        meeting_id: meeting.id,
        attendee_id: id,
        status: 'pending',
      }))

      await supabase.from('meeting_attendees').insert(attendees)
    }

    return NextResponse.json(
      { success: true, data: meeting },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create meeting error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

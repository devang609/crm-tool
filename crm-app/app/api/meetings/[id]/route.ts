import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get single meeting with attendees
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: meeting, error } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_attendees (
          id,
          attendee_id,
          status,
          profiles:attendee_id (full_name, email)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: meeting },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get meeting error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete meeting (organizer only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if organizer
    const { data: meeting } = await supabase
      .from('meetings')
      .select('organized_by')
      .eq('id', params.id)
      .single()

    if (!meeting || meeting.organized_by !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete meeting (cascades to attendees)
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: { message: 'Meeting deleted' } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete meeting error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

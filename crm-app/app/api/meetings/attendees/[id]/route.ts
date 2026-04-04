import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Update attendance status
export async function PUT(
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

    const { status } = await request.json()

    if (!['pending', 'accepted', 'declined'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update attendance for current user
    const { data: updated, error } = await supabase
      .from('meeting_attendees')
      .update({ status })
      .eq('id', params.id)
      .eq('attendee_id', session.user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Attendance not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update attendance error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

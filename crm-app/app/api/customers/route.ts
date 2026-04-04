import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get customers (filtered by role)
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

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, id')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    let query = supabase.from('customers').select('*, assigned_to(*)')

    // Filter by role
    if (profile.role === 'EMPLOYEE') {
      query = query.eq('assigned_to', session.user.id)
    } else if (profile.role === 'CLIENT') {
      query = query.eq('email', profile.role === 'CLIENT' ? profile.email : '')
      // This won't work properly due to RLS, will be handled by database
    }

    // If ADMIN, show all customers

    const { data: customers, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: customers },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create customer
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

    // Check authorization
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'EMPLOYEE')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { full_name, email, phone, company, status, notes, assigned_to } =
      await request.json()

    // Validate input
    if (!full_name) {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      )
    }

    // Create customer
    const { data: customer, error } = await supabase
      .from('customers')
      .insert([
        {
          full_name,
          email: email || null,
          phone: phone || null,
          company: company || null,
          status: status || 'lead',
          notes: notes || null,
          assigned_to: assigned_to || null,
          created_by: session.user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: customer },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

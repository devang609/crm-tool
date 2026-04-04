import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get single customer
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

    // Get customer
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: customer },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update customer
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

    // For EMPLOYEE, check if assigned to them
    if (profile.role === 'EMPLOYEE') {
      const { data: customer } = await supabase
        .from('customers')
        .select('assigned_to')
        .eq('id', params.id)
        .single()

      if (!customer || customer.assigned_to !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        )
      }
    }

    const { full_name, email, phone, company, status, notes, assigned_to } =
      await request.json()

    const updateData: any = {}

    // Get current customer to check permissions
    const { data: currentCustomer } = await supabase
      .from('customers')
      .select('assigned_to')
      .eq('id', params.id)
      .single()

    if (!currentCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    // For EMPLOYEE: only allow status changes if assigned to this customer
    if (profile.role === 'EMPLOYEE') {
      if (currentCustomer.assigned_to !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        )
      }
      // Employee can only change status, no other fields
      if (status !== undefined) {
        updateData.status = status
      }
    } else if (profile.role === 'ADMIN') {
      // Admin can change anything except assigned_to restrictions
      if (full_name) updateData.full_name = full_name
      if (email !== undefined) updateData.email = email
      if (phone !== undefined) updateData.phone = phone
      if (company !== undefined) updateData.company = company
      if (status !== undefined) updateData.status = status
      if (notes !== undefined) updateData.notes = notes
      if (assigned_to !== undefined) updateData.assigned_to = assigned_to
    }

    updateData.updated_at = new Date().toISOString()

    const { data: updatedCustomer, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: updatedCustomer },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update customer error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete customer (ADMIN only)
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

    // Check if ADMIN
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete customer
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: { message: 'Customer deleted' } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete customer error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

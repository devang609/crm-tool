import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GROQ_API_KEY not configured' },
        { status: 500 }
      )
    }

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
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    let briefingData = ''

    if (profile.role === 'ADMIN') {
      // Get today's meetings
      const today = new Date().toISOString().split('T')[0]
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

      const { data: todayMeetings } = await supabase
        .from('meetings')
        .select('*')
        .gte('start_time', today)
        .lt('start_time', tomorrow)
        .order('start_time', { ascending: true })

      // Get all non-inactive leads with their assigned employees
      const { data: leads } = await supabase
        .from('customers')
        .select(`
          *,
          profiles:assigned_to (full_name)
        `)
        .in('status', ['LEAD', 'IN_PROGRESS', 'CONVERTED'])

      // Calculate employee success rates
      const { data: allEmployees } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'EMPLOYEE')

      const employeeStats: Record<string, any> = {}

      for (const emp of allEmployees || []) {
        const { count: assigned } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', emp.id)

        const { count: converted } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', emp.id)
          .eq('status', 'CONVERTED')

        const { count: inactive } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', emp.id)
          .eq('status', 'INACTIVE')

        employeeStats[emp.full_name] = {
          total_assigned: assigned || 0,
          converted: converted || 0,
          inactive: inactive || 0,
          success_rate: assigned ? (((converted || 0) / assigned) * 100).toFixed(1) : 0,
        }
      }

      briefingData = `
ADMIN DAILY BRIEFING

TODAY'S MEETINGS:
${todayMeetings && todayMeetings.length > 0
  ? todayMeetings
      .map(
        (m) =>
          `- ${m.title} at ${new Date(m.start_time).toLocaleTimeString()} (${m.meeting_link ? 'with link' : 'no link'})`
      )
      .join('\n')
  : 'No meetings scheduled for today'}

ACTIVE LEADS STATUS:
${leads
  ?.map(
    (l) =>
      `- ${l.full_name} (${l.status}) - Assigned to: ${l.profiles?.full_name || 'Unassigned'}`
  )
  .join('\n') || 'No leads found'}

EMPLOYEE PERFORMANCE:
${Object.entries(employeeStats)
  .map(
    ([name, stats]: [string, any]) =>
      `- ${name}: ${stats.converted}/${stats.total_assigned} converted (${stats.success_rate}% success rate, ${stats.inactive} lost)`
  )
  .join('\n')}
      `
    } else if (profile.role === 'EMPLOYEE') {
      // Get all assigned customers with last interaction
      const { data: customers } = await supabase
        .from('customers')
        .select(`
          id,
          full_name,
          status,
          assigned_to
        `)
        .eq('assigned_to', session.user.id)
        .in('status', ['LEAD', 'IN_PROGRESS', 'CONVERTED'])

      const customerInteractions: any[] = []

      for (const customer of customers || []) {
        const { data: interactions } = await supabase
          .from('interactions')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
          .limit(1)

        customerInteractions.push({
          customer_name: customer.full_name,
          status: customer.status,
          last_interaction: interactions?.[0] || null,
        })
      }

      briefingData = `
EMPLOYEE DAILY BRIEFING

YOUR ASSIGNED LEADS:
${customerInteractions
  .map(
    (ci) =>
      `- ${ci.customer_name} (${ci.status})
  Last interaction: ${
        ci.last_interaction
          ? `${ci.last_interaction.type} - "${ci.last_interaction.summary}" on ${new Date(ci.last_interaction.created_at).toLocaleDateString()}`
          : 'No interactions yet'
      }`
  )
  .join('\n')}
      `
    }

    // Send to Groq for AI enhancement (super fast!)
    const message = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `You are a professional CRM assistant. Take this raw briefing data and create a concise, actionable daily briefing for the user. Add helpful suggestions and insights based on the data. Keep it professional but friendly. Maximum 300 words.\n\n${briefingData}`,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
    })

    const briefing =
      message.choices[0]?.message?.content || 'Unable to generate briefing'

    return NextResponse.json(
      { success: true, data: { briefing, rawData: briefingData } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Briefing error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate briefing'

    return NextResponse.json(
      { success: false, error: errorMessage || 'Failed to generate briefing' },
      { status: 500 }
    )
  }
}

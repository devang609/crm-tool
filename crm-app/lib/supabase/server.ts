import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createSupabaseServerClient = () => {
  return createRouteHandlerClient({
    cookies,
  })
}

// For admin operations using service role
export const createSupabaseAdminClient = () => {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

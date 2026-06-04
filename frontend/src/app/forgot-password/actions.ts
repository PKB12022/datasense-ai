'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const headersList = await headers()
  let origin = headersList.get('origin')
  
  if (!origin) {
    const host = headersList.get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    origin = `${protocol}://${host}`
  }

  const email = formData.get('email') as string

  if (!email) {
    redirect('/forgot-password?error=Email is required')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    redirect('/forgot-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/forgot-password?message=Check your email for the password reset link.')
}

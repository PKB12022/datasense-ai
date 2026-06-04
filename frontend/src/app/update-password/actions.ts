'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 6) {
    redirect('/update-password?error=Password must be at least 6 characters long')
  }

  if (password !== confirmPassword) {
    redirect('/update-password?error=Passwords do not match')
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect('/update-password?error=' + encodeURIComponent(error.message))
  }

  // Password updated successfully, redirect to dashboard
  redirect('/dashboard')
}

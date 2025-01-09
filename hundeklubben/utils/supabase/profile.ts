'use server'

import { createClient } from "./server"

export async function requestPasswordReset(email: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/reset-password`,
  })

  if (error) {
    throw new Error(`Failed to request password reset: ${error.message}`)
  }

  return { success: true }
}

export async function updateProfile(name: string, phone: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.updateUser({
    data: { name, phone }
  })

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`)
  }

  return data.user
}



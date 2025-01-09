'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = async () =>
  createServerComponentClient({ cookies })

export const createAdminSupabaseClient = async () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

export async function deleteUser(userId: string) {
  const supabase = createAdminSupabaseClient()
  
  // Delete the user
  const { error } = await (await supabase).auth.admin.deleteUser(userId)

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`)
  }

  return { success: true }
}

export async function getUsers() {
  const supabase = createAdminSupabaseClient()
  
  const { data, error } = await (await supabase).auth.admin.listUsers()

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }

  if (!data || !data.users) {
    throw new Error('No users data returned')
  }

  // Fetch additional user data from user_metadata
  const enhancedUsers = data.users.map(user => ({
    id: user.id || "N/A",
    email: user.email || "N/A",
    created_at: user.created_at || "N/A",
    name: user.user_metadata?.name || 'N/A',
    phone: user.user_metadata?.phone || 'N/A'
  }))

  return enhancedUsers
}


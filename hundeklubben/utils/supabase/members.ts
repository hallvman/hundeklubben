'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkAdminRole } from './auth'

export async function addMember(formData: FormData) {
    const email = formData.get('email') as string
    const supabase = createClient()
  
    const { error } = await supabase
      .from('members')
      .insert({ email })
  
    if (error) {
      return { success: false, message: error.message }
    }
  
    revalidatePath('/calendar/users')
    return { success: true, message: 'Member added successfully' }
  }
  
  export async function deleteMember(formData: FormData) {
    const email = formData.get('email') as string
    const supabase = createClient()
  
    const isAdmin = await checkAdminRole()

    if(!isAdmin.isAdmin)
        return { success: false, message: "Du har ikke tilgang til å slette brukere!" }

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('email', email)
  
    if (error) {
      return { success: false, message: error.message }
    }
  
    revalidatePath('/calendar/users')
    return { success: true, message: `Medlem ${email} ble slettet!` }
  }
  
  export async function getMembers() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('members')
      .select('email')
  
    if (error) {
      console.error('Error fetching members:', error)
      return []
    }
  
    return data
  }
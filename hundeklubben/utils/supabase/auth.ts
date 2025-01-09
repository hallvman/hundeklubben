"use server"
import { createClient } from './server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function checkEmail(email: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('members')
      .select('email')
      .eq('email', email)
      .single()
  
    if (error) {
      console.error('Error checking email:', error.message)
      return { exists: false, error: error.message }
    }
  
    return { exists: !!data, error: null }
  }

  export const getUser = async () => {
    const supabase = createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user;
  };

  export async function checkAdminRole() {
    const supabase = createClient()
    const {
        data: { user },
      } = await supabase.auth.getUser();
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single()
  
      const isAdmin = !!data
      return { isAdmin, error: null }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { isAdmin: false, error: error }
    }
  }

   export async function getUserEmail() {
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      const email = user ? user?.email : ""

      return email
    } catch (error) {
      console.error('Unexpected error:', error)
      return ""
    }
  }
  

export async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut();
  
    if(error)
      throw new Error(error.message || "Unknown error");
  
    redirect("/")
  }

  export async function signUp(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = createClient();
    const origin = (await headers()).get("origin");
  
    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }
  
    const { exists, error: checkError } = await checkEmail(email);
  
    if (checkError) {
      return { success: false, message: "Error checking email" };
    }
  
    if (!exists) {
      return { success: false, message: "Du er ikke lagt til som ett medlem. Hør med styret om du kan bli lagt til!" };
    }
  
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
  
    if (error) {
      console.error(error.code + " " + error.message);
      return { success: false, message: "Error trying to sign up" };
    } else {
      return { success: true, email };
    }
  }

  
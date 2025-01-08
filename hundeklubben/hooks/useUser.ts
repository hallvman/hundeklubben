"use client"
import { getUser } from '@/utils/supabase/auth'
import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser()
        setUser(userData as User)
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}
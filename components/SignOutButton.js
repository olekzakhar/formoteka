// components/SignOutButton.js

'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils'
import LoadingIcon from '@/components/icons/Loading'
import { BASE_URL } from '@/constants'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      setLoading(false)
      return
    }
    
    router.push(BASE_URL)
    router.refresh()
  }

  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-3',
        loading ? 'cursor-not-allowed' : undefined
      )}
      onClick={handleSignOut}
      disabled={loading}
    >
      Sign out
      {loading && <LoadingIcon loading={loading} className="relative w-4 h-4" />}
    </button>
  )
}

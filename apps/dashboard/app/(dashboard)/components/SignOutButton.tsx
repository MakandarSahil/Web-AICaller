'use client'

import { Button } from '@aicaller/ui'
import { LogOut } from 'lucide-react'
import { createClient } from '@aicaller/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push('/login')
    } catch (err) {
      console.error('Sign out failed:', err)
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      disabled={loading}
      className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Log out
    </Button>
  )
}

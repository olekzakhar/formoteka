
// app/(Auth)/reset-password/page

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// import MinHeader from '@/components/MinHeader'
import ResetPasswordForm from './form'

export const metadata = {
  title: 'Reset password'
}

export default async function ResetPassword({ searchParams }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user && searchParams?.type !== 'recovery') {
    redirect('/private')
  }

  return (
    <>
      {/* <MinHeader /> */}
      <main>
        <ResetPasswordForm />
      </main>
    </> 
  )
}

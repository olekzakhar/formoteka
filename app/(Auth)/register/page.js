// app/(Auth)/register/page

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { FORMS_PATH } from '@/constants'

import LoginForm from '@/app/(Auth)/login/form'

export const metadata = {
  title: 'Register'
}

export default async function Register() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect(FORMS_PATH)
  }

  return (
    <>
      {/* <MinHeader /> */}
      <main>
        <LoginForm loginForm={false} />
      </main>
    </>
  )
}

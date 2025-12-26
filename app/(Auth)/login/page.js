// app/login/page

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { FORMS_PATH } from '@/constants'

// import MinHeader from '@/components/MinHeader'
import SignInForm from '@/app/(Auth)/login/form'

export const metadata = {
  title: 'Log in'
}

export default async function SignIn() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect(FORMS_PATH)
  }

  return (
    <>
      {/* <MinHeader /> */}
      <main>
        <SignInForm />
      </main>
    </>
  )
}

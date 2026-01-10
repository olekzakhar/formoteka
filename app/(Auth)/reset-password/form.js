// app/(Auth)/reset-password/form

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { login, register, signInGoogle } from '@/app/(Auth)/login/actions'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { BASE_URL, FORMS_PATH } from '@/constants'  // ← Add FORMS_PATH here
import { useForm } from 'react-hook-form'

import FormReset from './form/reset'
import FormUpdate from './form/update'
import FormSent from './form/sent'

export default function ResetPasswordForm({ user }) {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  const [loading, setLoading] = useState(false)
  const [currentForm, setCurrentForm] = useState(type ?? '')
  const [email, setEmail] = useState(null)

  async function handleResetPassword (formData) {
    setEmail(formData?.email)

    const { error } = await supabase.auth.resetPasswordForEmail(formData?.email, {
      redirectTo: `${BASE_URL}/reset-password?type=recovery`
    })

    if (error) {
      toast.error('Error. No verification link sent')
    } else {
      toast.success('We sent you a verification link')
      setCurrentForm('sent')
    }
  }

  async function handleResendEmail () {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${BASE_URL}/reset-password?type=recovery`
    })
    
    error
      ? toast.warning('Try again in a minute')
      : toast.success('We re-sent you a verification link')
  }

  async function handleUpdatePassword (formData) {
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: formData.password
    })

    if (error) {
      toast.error('The password has not been changed. Try again later')
      setLoading(false)
    } else {
      toast.success('The password has been changed')
      router.push(FORMS_PATH)  // ← Changed from '/' to FORMS_PATH
    }
  }

  const getForm = () => {
    switch (currentForm) {
      case 'sent':
        return <FormSent resendEmail={handleResendEmail} />
      case 'recovery':
        return <FormUpdate formAction={handleUpdatePassword} loading={loading} />
      default:
        return <FormReset formAction={handleResetPassword} />
    }
  }

  return (
    <>{getForm()}</>
  )
}

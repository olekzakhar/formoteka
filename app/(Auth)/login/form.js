// app/login/form

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormError from '@/components/form/Error'

import { login, register } from '@/app/(Auth)/login/actions'
import GoogleButton from '@/components/ui/googleButton'
import { toast } from 'sonner'
import { FORMS_PATH, SIGN_UP_PATH, SIGN_IN_PATH } from '@/constants'

import FormSent from '@/app/(Auth)/reset-password/form/sent'

export default function LoginForm({ loginForm=true }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(null)
  const [isLogin, setIsLogin] = useState(loginForm)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        router.push(FORMS_PATH)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const {
    register: registerField,
    unregister,
    formState: {
      errors,
      isValid,
      isSubmitting
    },
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch
  } = useForm({ mode: 'onSubmit' })

  const onSubmit = async (formData) => {
    setLoading(true)

    if (isLogin) {
      const response = await login(formData)

      if (response?.error) {
        toast.error('Помилка. Неправильний email або пароль')
        setLoading(false)
      }
    } else {
      const response = await register(formData)

      if (response?.error) {
        toast.error('Помилка. Спробуйте пізніше')
        setLoading(false)
      } else {
        setEmail(formData.email)
        setSuccess(true)
      }
    }
  }

  const handleResendSignUpEmail = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    })

    error
      ? toast.error('Error. No verification link sent')
      : toast.success('We re-sent you a verification link')
  }

  const handleBackLinkSuccess = () => {
    reset()
    setIsLogin(true)
    setLoading(false)
    setSuccess(false)
  }
  
  return (
    <>
      {success
        ? <FormSent
            resendEmail={handleResendSignUpEmail}
            backLink={handleBackLinkSuccess}
          />
        : <div className="px-4">
            <div className="mt-8 mx-auto max-w-[402px] bg-white border border-[#E8E8E8] rounded-2xl">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 max-[400px]:px-4 flex flex-col flex-shrink-0 max-w-[400px]"
              >
                {isLogin
                  ? <h1 className="text-2xl">Увійти</h1>
                  : <h1 className="text-2xl">Створити акаунт</h1>
                }

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Input
                      type="email"
                      {...registerField('email', {
                        required: `Електронна адреса обовʼязкова`,
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Невірна електронна адреса"
                        }
                      })}
                      placeholder="Електронна пошта" />
                    <FormError field={errors?.email} />

                    <Input
                      type="password"
                      {...registerField('password', {
                        required: `Пароль обовʼязковий`,
                        minLength: {
                          value: 6,
                          message: "Пароль має бути не коротший за 6 символів"
                        },
                        maxLength: {
                          value: 100,
                          message: 'Не більше 100 символів'
                        }
                      })}
                      placeholder="Пароль" />
                      <FormError field={errors?.password} />
                  </div>

                  {isLogin &&
                    <div className="text-center">
                      <Link
                        href="/reset-password"
                        className="text-xs underline underline-offset-4 hover:text-zinc-800 transition-colors duration-150"
                      >
                        Забули пароль?
                      </Link>
                    </div>
                  }

                  {isLogin
                    ? <Button
                        type="submit"
                        variant="black"
                        loading={loading}
                        disabled={loading}
                      >
                        Увійти
                      </Button>
                    : <Button
                        type="submit"
                        variant="black"
                        className="mt-1"
                        loading={loading}
                        disabled={loading}
                      >
                        Створити акаунт
                      </Button>
                  }
                </div>

                <hr className="mt-4 border-[#E8E8E8]" />

                <GoogleButton />

                {isLogin
                  ? <p className="mt-8 text-center text-sm text-zinc-600">
                      Немає акаунта?&nbsp;
                      <Link
                        href={SIGN_UP_PATH}
                        className="underline underline-offset-4 hover:text-zinc-800 cursor-pointer transition-colors duration-150"
                      >
                        Створити акаунт
                      </Link>
                    </p>
                  : <p className="mt-8 text-center text-sm text-zinc-600">
                      Вже є акаунт? <Link href={SIGN_IN_PATH} className="underline underline-offset-4 hover:text-zinc-800 cursor-pointer">Увійти</Link>
                    </p>
                }
              </form>
            </div>
          </div>
      }
    </>
  )
}

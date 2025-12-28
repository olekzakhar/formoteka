// app/login/form

'use client'

import { useState, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button-2'
// import FormError from '@/components/form/Error'

import { signIn, signUp } from '@/app/(Auth)/login/actions'
import GoogleButton from '@/components/ui/googleButton'
// import { toast } from 'sonner'
import { FORMS_PATH, SIGN_UP_PATH, SIGN_IN_PATH } from '@/constants'

// import FormSent from '@/app/(Auth)/reset-password/form/sent'

export default function SignInForm({ signInForm=true }) {
  const supabase = createClient()
  const router = useRouter()

  // const [state, action, pending] = useActionState(signIn)

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(null)
  const [isLogin, setIsLogin] = useState(signInForm)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'SIGNED_IN')
        router.push(FORMS_PATH)
    })
  })

  const {
    register,
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

    // const response = isLogin
    //   ? await signIn(formData)
    //   : await signUp(formData)

    // if (response?.error) {
    //   toast.error('Error. Invalid email or password')
    //   setLoading(false)
    // }

    if (isLogin) {
      const response = await signIn(formData)

      // console.log('Log In Error: ', response.error, response.status)

      if (response?.error) {
        // toast.error('Error. Invalid email or password')
        setLoading(false)
      }
    } else {
      const response = await signUp(formData)

      if (response?.error) {
        // toast.error('Error. Try later')
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

    // error
    //   ? toast.error('Error. No verification link sent')
    //   : toast.success('We re-sent you a verification link')
  }

  const handleBackLinkSuccess = () => {
    reset()
    setIsLogin(true)
    setLoading(false)
    setSuccess(false)
  }
  
  return (
    // bg-neutral-300/30
    // bg-[#F1F1EF]
    <>
      {success
        // ? <FormSent
        //     resendEmail={handleResendSignUpEmail}
        //     backLink={handleBackLinkSuccess}
        //   />
          // absolute top-[20%] left-1/2 -translate-x-1/2
        ? <div>Form sent</div>
        : <div className="px-4">
            <div className="mt-8 mx-auto max-w-[402px] bg-white border border-[#E8E8E8] rounded-2xl">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 max-[400px]:px-4 flex flex-col flex-shrink-0 max-w-[400px]"
              >
                {isLogin
                  ? <h1 className="text-2xl">Log in</h1>
                  : <h1 className="text-2xl">Sign up</h1>
                }

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Invalid email address"
                        }
                      })}
                      placeholder="Email address" />
                    {/* <FormError field={errors?.email} /> */}

                    <Input
                      type="password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters long"
                        },
                        maxLength: {
                          value: 100,
                          message: 'Не більше 100 символів'
                        }
                      })}
                      placeholder="Password" />
                      {/* <FormError field={errors?.password} /> */}
                  </div>

                  {isLogin &&
                    <div className="text-center">
                      <Link
                        href="/reset-password"
                        className="text-xs underline underline-offset-4 hover:text-zinc-800 transition-colors duration-150"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  }

                  {isLogin
                    ? <Button
                        type="submit"
                        // full
                        // loading={loading}
                      >
                        Log in
                      </Button>
                    : <Button
                        type="submit"
                        // full
                        className="mt-1"
                        // loading={loading}
                      >
                        Sign up
                      </Button>
                  }
                </div>

                <hr className="mt-4 border-[#E8E8E8]" />

                <GoogleButton />

                {/* <div className="my-3 text-center text-sm">or</div> */}


                {/* <p className="mt-8 text-center text-sm text-zinc-600">
                  By clicking continue, you agree to our <a className="underline underline-offset-4 hover:text-zinc-800" href="https://rapidforms.co/terms-of-service"> Terms of Service</a> and <a className="underline underline-offset-4 hover:text-zinc-800" href="https://rapidforms.co/privacy-policy">Privacy Policy</a>.
                </p> */}

                {isLogin
                  ? <p className="mt-8 text-center text-sm text-zinc-600">
                      Don&apos;t have an account?&nbsp;
                      <Link
                        href={SIGN_UP_PATH}
                        className="underline underline-offset-4 hover:text-zinc-800 cursor-pointer transition-colors duration-150"
                      >
                        Sign up
                      </Link>
                    </p>
                  : <p className="mt-8 text-center text-sm text-zinc-600">
                      Already have an account? <Link href={SIGN_IN_PATH} className="underline underline-offset-4 hover:text-zinc-800 cursor-pointer">Log in</Link>
                    </p>
                }
              </form>
            </div>
          </div>
      }
    </>
  )
}

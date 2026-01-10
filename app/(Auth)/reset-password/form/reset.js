// app/(Auth)/reset-password/form/reset

'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormError from '@/components/form/Error'
import BackLink from '@/components/BackLink'
import { SIGN_IN_PATH } from '@/constants'

export default function FormReset({ formAction }) {
  const {
    register,
    formState: {
      errors,
      isSubmitting
    },
    handleSubmit
  } = useForm({ mode: 'onSubmit' })

  return (
    <div className="px-4">
      <div className="mt-8 mx-auto max-w-[402px] bg-white border border-[#E8E8E8] rounded-2xl">
        <form
          onSubmit={handleSubmit(formAction)}
          className="p-6 max-[400px]:px-4 flex flex-col flex-shrink-0 max-w-[400px]"
        >
          <h1 className="text-2xl">Reset your password</h1>
          <p className="mt-1 text-sm text-zinc-500">No worries, we&apos;ll help you reset it</p>

          <div className="mt-6">
            <Input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address"
                }
              })}
              placeholder="Email address" 
            />
            <FormError field={errors?.email} />

            <Button
              className="mt-4 w-full"
              type="submit"
              variant="black"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Reset Password'}
            </Button>
          </div>

          <BackLink
            path={SIGN_IN_PATH}
            pathName="login"
            className="mt-4"
          />
        </form>
      </div>
    </div>
  )
}

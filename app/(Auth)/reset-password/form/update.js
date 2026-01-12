// app/(Auth)/reset-password/form/update

'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormError from '@/components/form/Error'
import BackLink from '@/components/BackLink'
import { SIGN_IN_PATH } from '@/constants'

export default function FormUpdate({ formAction, loading = false }) {
  const {
    register,
    formState: {
      errors
      // isSubmitting
    },
    handleSubmit,
    watch
  } = useForm({ mode: 'onSubmit' })

  const password = watch('password')

  return (
    // absolute top-[20%] left-1/2 -translate-x-1/2
    <div className="px-4">
      <div className="mt-8 mx-auto max-w-[402px] bg-white border border-[#E8E8E8] rounded-2xl">
        <form
          onSubmit={handleSubmit(formAction)}
          className="p-6 max-[400px]:px-4 flex flex-col flex-shrink-0 max-w-[400px]"
        >
          <h1 className="text-2xl">Скинути пароль</h1>
          <p className="mt-1 text-sm text-zinc-500">Введіть новий пароль</p>

          <div className="mt-6">
            <div className="flex flex-col gap-2">
              <Input
                type="password"
                {...register('password', {
                  required: 'Пароль обов’язковий',
                  minLength: {
                    value: 6,
                    message: "Мінімум 6 символів"
                  },
                  maxLength: {
                    value: 100,
                    message: 'Не більше 100 символів'
                  }
                })}
                placeholder="Новий пароль"
              />
              <FormError field={errors?.password} />

              <Input
                type="password"
                {...register('confirm_password', {
                  required: 'Підтвердіть пароль',
                  validate: (value) =>
                    value === password || 'Паролі не співпадають',
                })}
                placeholder="Підтвердження пароля"
              />
              <FormError field={errors?.['confirm_password']} />
            </div>

            <Button
              className="mt-4 w-full"
              variant="black"
              type="submit"
              // formAction={formAction}
              loading={loading}
            >
              Скинути пароль
            </Button>
          </div>

          <BackLink
            path={SIGN_IN_PATH}
            pathName="входу"
            className="mt-4"
          />
        </form>
      </div>
    </div>
  )
}

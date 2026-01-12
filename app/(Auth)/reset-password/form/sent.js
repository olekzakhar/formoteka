// app/(Auth)/reset-password/form/sent

'use client'

import Link from 'next/link'
import BackLink from '@/components/BackLink'
import { SIGN_IN_PATH } from '@/constants'
import { Button } from '@/components/ui/button'

export default function FormSent({ resendEmail, backLink=null }) {
  return (
    // absolute top-[20%] left-1/2 -translate-x-1/2
    <div className="px-4">
      <div className="mt-8 mx-auto max-w-[402px] bg-white border border-[#E8E8E8] rounded-2xl">
        <form className="p-6 max-[400px]:px-4 flex flex-col flex-shrink-0 max-w-[400px]">
          <h1 className="text-2xl">Перевірте пошту</h1>
          <p className="mt-1 text-sm text-zinc-500">Ми надіслали вам посилання для підтвердження</p>

          <div className="mt-2">
            <Button asChild className="mt-4 w-full" variant="secondary">
              <Link href="mailto:" target="_blank">
                Відкрити пошту
              </Link>
            </Button>

            <p className="mt-6 text-center text-sm text-zinc-600">
              Не отримали листа?&nbsp;
              <button
                onClick={() => resendEmail()}
                type="button"
                className="underline underline-offset-4 hover:text-zinc-800 cursor-pointer transition-colors duration-150"
              >
                Надіслати ще раз
              </button>
            </p>
          </div>

          <BackLink
            path={SIGN_IN_PATH}
            backLink={backLink}
            pathName="входу"
            className="mt-6"
          />
        </form>
      </div>
    </div>
  )
}

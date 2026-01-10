// app/(Auth)/reset-password/form/sent

'use client'

import Link from 'next/link'
import BackLink from '@/components/BackLink'
import { SIGN_IN_PATH } from '@/constants'

export default function FormSent({ resendEmail, backLink=null }) {
  return (
    // absolute top-[20%] left-1/2 -translate-x-1/2
    <div className="px-4">
      <div className="mt-8 mx-auto max-w-[402px] bg-white border border-[#E8E8E8] rounded-2xl">
        <form className="p-6 max-[400px]:px-4 flex flex-col flex-shrink-0 max-w-[400px]">
          <h1 className="text-2xl">Check your email</h1>
          <p className="mt-1 text-sm text-zinc-500">We sent you a verification link</p>

          <div className="mt-2">
            <Link
              href="mailto:"
              target="_blank"
              className="mt-4 btn btn-neutral min-h-10 h-10 max-h-10 bg-transparent border border-zinc-600/90 hover:border-zinc-900/90 hover:bg-zinc-800/90 text-zinc-900 hover:text-zinc-50 font-medium w-full"
            >
              Open email app
            </Link>

            <p className="mt-6 text-center text-sm text-zinc-600">
              Didn&apos;t recieve the email?&nbsp;
              <button
                onClick={() => resendEmail()}
                type="button"
                className="underline underline-offset-4 hover:text-zinc-800 cursor-pointer transition-colors duration-150"
              >
                Click to resend
              </button>
            </p>
          </div>

          <BackLink
            path={SIGN_IN_PATH}
            backLink={backLink}
            pathName="login"
            className="mt-6"
          />
        </form>
      </div>
    </div>
  )
}

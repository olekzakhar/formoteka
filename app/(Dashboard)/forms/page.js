// app/(Dashboard)/forms/page

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getForms } from '@/server/action'
import { Button } from '@/components/ui/button'
import UserMenu from '@/components/UserMenu'
import { BASE_URL, FORMS_PATH } from '@/constants'
import Logo from '@/components/Logo'
import FormsCreateButton from '@/components/forms/CreateButton'
import FormCard from '@/components/forms/Card'

export default async function Forms() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch forms on the server
  const { forms, error } = await getForms(supabase, user.id)

  return (
    <>
      <header className="h-[52px] border-b border-border bg-card rounded-b-3xl flex items-center px-5 shrink-0 bg-transparent">
        {/* Left section - Back button and form name */}
        <div className="flex items-center gap-2">
          {/* Add content here if needed */}
        </div>
        
        {/* Logo */}
        <Link
          href={`${BASE_URL}${FORMS_PATH}`}
          className="-mt-0.5 absolute left-1/2 -translate-x-1/2 text-[#14171F]"
        >
          <Logo />
          {/* <Image
            src="/logo.svg"
            alt="Formoteka"
            height={26}
            width={0} // важливо, щоб Next.js не ламав
            style={{ width: 'auto', height: '26px' }}
            className="w-auto h-[26px] text-fuchsia-600"
            priority
          /> */}
        </Link>

        {/* Right section - User menu */}
        <div className="flex items-center gap-3 ml-auto">
          <UserMenu userEmail={user.email || ''} />
        </div>
      </header>

      <main className="p-3 pt-8 sm:p-6 sm:pt-12 md:p-8 md:pt-14">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-6 px-3 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Мої форми</h1>
            </div>
            <FormsCreateButton userId={user?.id} />
          </div>

          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              Помилка завантаження форм: {error}
            </div>
          )}

          {forms && forms.length > 0 ? (
            <div className="flex flex-col gap-4">
              {forms.map((form) => (
                <FormCard key={form.id} form={form} userId={user?.id} />
              ))}
            </div>
          ) : !error ? (
            <div className="p-12 mt-3 flex flex-col items-center justify-center shadow-sm bg-card rounded-2xl">
              <svg 
                className="w-16 h-16 text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-2">Поки що немає форм</p>
              <p className="text-gray-400 text-sm mb-4">Створіть свою першу форму, щоб почати</p>
              <FormsCreateButton userId={user?.id} />
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}

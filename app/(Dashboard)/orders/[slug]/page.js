// app/(Dashboard)/orders/[slug]/page

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
// import { getForms } from '@/server/action'
import { getForm } from '@/server/action'
// import FormCard from '@/components/FormCard'
// import { Button } from '@/components/ui/button'
import { BASE_URL, FORMS_PATH } from '@/constants'
import UserMenu from '@/components/UserMenu'
import Logo from '@/components/Logo'
import OrdersList from '@/components/orders/List'

export default async function Forms({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { form, error } = await getForm(supabase, slug)

  // Fetch forms on the server
  // const { forms, error } = await getForms(supabase, user.id)

  return (
    <>
      <header className="h-[52px] border-b border-border bg-card rounded-b-3xl flex items-center px-5 shrink-0 bg-transparent">
        {/* Left section - Back button and form name */}
        <div className="flex items-center gap-2"></div>
        
        {/* Logo */}
        <Link
          href={`${BASE_URL}${FORMS_PATH}`}
          className="-mt-0.5 absolute left-1/2 -translate-x-1/2 text-[#14171F]"
        >
          <Logo />
        </Link>

        {/* Right section - User menu */}
        <div className="flex items-center gap-3 ml-auto">
          <UserMenu userEmail={user.email || ''} />
        </div>
      </header>

      <main className="p-0 py-3 pt-8 sm:pt-12 lg:p-8 md:pt-14">
        <OrdersList name={form?.name} />
      </main>
    </>
  )
}

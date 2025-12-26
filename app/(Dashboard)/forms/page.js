// app/forms/page

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { getForms } from '@/server/action'
import SignOutButton from '@/components/SignOutButton'
import { BASE_URL, FORMS_PATH } from '@/constants'

export default async function Forms() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch forms on the server
  const { forms, error } = await getForms(supabase, user.id)

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Привіт, {user.email}!</h1>
            <p className="text-gray-600 mt-2">Вітаємо на Dashboard</p>
          </div>
          <SignOutButton />
        </div>
        
        <Link href="/forms/slug">Редактор форми</Link>
        {/* Your dashboard content here */}


        {forms?.length
          ? <div className="mt-4 flex flex-col gap-4">
              {forms.map((form, i) =>
                <div key={form.id} className="group bg-[#F3F4F5] flex justify-between items-center border border-[#E8E8E8] rounded-2xl">
                  <div>
                    <div>{form?.name}</div>
                    <div>{BASE_URL}/{form?.slug}</div>
                  </div>
                  <Link href={`${FORMS_PATH}/${form.slug}`}>Edit</Link>
                </div>
              )}
            </div>
          : <div className="p-7 mt-3 flex justify-center items-center border bg-white border-[#E8E8E8] rounded-2xl">
              No forms yet
            </div>
        }
      </div>
    </main>
  )
}

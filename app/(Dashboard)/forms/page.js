// app/forms/page

// import { redirect } from 'next/navigation'
// import Link from 'next/link'
// import { createClient } from '@/utils/supabase/server'
// import { getForms } from '@/server/action'
// import SignOutButton from '@/components/SignOutButton'
// import FormCard from '@/components/FormCard'
// import { Button } from '@/components/ui/button'

// export default async function Forms() {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) redirect('/login')

//   // Fetch forms on the server
//   const { forms, error } = await getForms(supabase, user.id)

//   return (
//     <>
//       <header className="h-[52px] border-b border-border bg-card rounded-b-3xl flex items-center px-5 shrink-0 bg-transparent">
//         {/* Left section - Back button and form name - fixed width */}
//         <div className="flex items-center gap-2">

//         </div>
        
//         {/* Center - Brand name - absolute positioned to stay centered */}
//         <div className="absolute left-1/2 -translate-x-1/2">
//           <span className="text-lg font-semibold text-foreground">Formoteka</span>
//         </div>

//         {/* Right section - Action buttons - fixed width */}
//         <div className="flex items-center gap-1 ml-auto">
//           <div className="w-7 h-7 bg-blue-400 rounded-full"></div>
//         </div>
//       </header>

//       <main className="p-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold">Форми {user.email}!</h1>
//             </div>
//             <SignOutButton />
//           </div>

//           {forms?.length
//             ? <div className="mt-4 flex flex-col gap-4">
//                 {forms.map((form) =>
//                   <FormCard key={form.id} form={form} />
//                 )}
//               </div>
//             : <div className="p-7 mt-3 flex justify-center items-center border bg-white border-[#E8E8E8] rounded-2xl">
//                 No forms yet
//               </div>
//           }

//           <Button className="mt-4">
//             Створити форму
//           </Button>
//         </div>
//       </main>
//     </>
//   )
// }








import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getForms } from '@/server/action'
import FormCard from '@/components/FormCard'
import { Button } from '@/components/ui/button'
import UserMenu from '@/components/UserMenu'

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
        
        {/* Center - Brand name - absolute positioned to stay centered */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-lg font-semibold text-foreground">Formoteka</span>
        </div>

        {/* Right section - User menu */}
        <div className="flex items-center gap-3 ml-auto">
          <UserMenu userEmail={user.email || ''} />
        </div>
      </header>

      <main className="p-8 pt-14">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-6 px-3 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Мої форми</h1>
            </div>
            <Button variant="black" size="sm-black">
              Створити форму
            </Button>
          </div>

          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              Помилка завантаження форм: {error}
            </div>
          )}

          {forms && forms.length > 0 ? (
            <div className="flex flex-col gap-4">
              {forms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </div>
          ) : !error ? (
            <div className="p-12 mt-3 flex flex-col items-center justify-center border bg-white border-[#E8E8E8] rounded-2xl">
              <svg 
                className="w-16 h-16 text-gray-300 mb-4" 
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
              <Button variant="black" size="sm-black">
                Створити форму
              </Button>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
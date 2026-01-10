// // app/signin/actions

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
// // import { BASE_URL } from '@/constants'
// // import { DASHBOARD_PATH } from '@/constants'

// import { createClient } from '@/utils/supabase/server'

// export async function signIn(formData) {
//   const supabase = await createClient()

//   const { error } = await supabase.auth.signInWithPassword(formData)

//   if (error) {
//     return { error: true, status: error.status }
//   }

//   // revalidatePath(DASHBOARD_PATH, 'layout')
//   // redirect(DASHBOARD_PATH)
//   revalidatePath('/dashboard', 'layout')
//   redirect('/dashboard')
// }

// export async function signUp(formData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   // const data = {
//   //   email: formData.get('email'),
//   //   password: formData.get('password')
//   // }

//   const { error } = await supabase.auth.signUp({
//     ...formData,
//     options: {
//       // emailRedirectTo: `${BASE_URL}${DASHBOARD_PATH}`
//       // emailRedirectTo: `/${DASHBOARD_PATH}`
//       emailRedirectTo: `/dashboard`
//     }
//   })

//   if (error) {
//     return { error: true, status: error.status }
//   }

//   // тут потрібно показувати повідомлення підтвердіть електронну пошу
//   // revalidatePath('/', 'layout')
//   // redirect('/')
// }

// export async function signInGoogle() {
//   const supabase = await createClient()

//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       // redirectTo: `${BASE_URL}/auth/callback?next=/dashboard`
//       redirectTo: `/auth/callback?next=/dashboard`
//     }
//   })

//   // redirect(data.url)

//   if (error) {
//     redirect('/error')
//   }

  

//   revalidatePath(data.url, 'layout')
//   redirect(data.url)
// }

// export async function signOut() {
//   const supabase = await createClient()

//   const { error } = await supabase.auth.signOut()

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }





// app/login/actions.js

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { FORMS_PATH } from '@/constants'

export async function login(formData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(formData)

  if (error) return { error: true, status: error.status }

  revalidatePath(FORMS_PATH, 'layout')
  redirect(FORMS_PATH)
}

export async function register(formData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    ...formData,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback` }
  })

  if (error) return { error: true, status: error.status }
}

// export async function signOut() {
//   const supabase = await createClient()
//   const { error } = await supabase.auth.signOut()

//   if (error) redirect('/error')

//   revalidatePath('/', 'layout')
//   redirect('/')
// }

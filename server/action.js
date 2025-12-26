import { cache } from 'react'

async function fetchForm(supabase, slug) {
  const { data: form, error } = await supabase
    .from('forms')
    .select('*')
    .eq('slug', slug)
    // .eq('enabled', true)
    .single()

  return { form, error }
}
export const getForm = cache(fetchForm)

async function fetchForms(supabase, userId) {
  const { data: forms, error } = await supabase
    .from('forms')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { forms, error }
}
export const getForms = cache(fetchForms)

async function fetchAllFormsSlugs(supabase) {
  const { data: forms, error } = await supabase
    .from('forms')
    .select('slug')
    .order('created_at', { ascending: false })

  return { forms, error }
}
export const getAllFormsSlugs = cache(fetchAllFormsSlugs)

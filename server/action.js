// server/action

import { cache } from 'react'
import { nanoid } from '@/utils'

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


// Створення нової форми
export async function createForm(supabase, userId) {  
  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    const code = nanoid(6)
    const slug = `form-${code}`
    const name = `Форма ${code}`
    
    const { data, error } = await supabase
      .from('forms')
      .insert({
        user_id: userId,
        slug: slug,
        name: name
      })
      .select()
      .single()
    
    // Якщо успішно створено, повертаємо результат
    if (!error) {
      return { form: data, error: null }
    }
    
    // Якщо помилка унікальності slug, пробуємо ще раз
    if (error.code === '23505') {
      attempts++
      continue
    }
    
    // Інша помилка - повертаємо її
    return { form: null, error: error.message }
  }
  
  return { form: null, error: 'Не вдалося згенерувати унікальний slug після кількох спроб' }
}

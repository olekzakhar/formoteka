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
  
  return { form: null, error: 'Не вдалося згенерувати унікальну назву' }
}



// Видалення форми
export async function deleteForm(supabase, formSlug, userId) {
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('slug', formSlug)
    .eq('user_id', userId) // Перевірка, що форма належить користувачу

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}



// Дублювання форми
export async function duplicateForm(supabase, formSlug, userId) {
  // Спочатку отримуємо оригінальну форму
  const { data: originalForm, error: fetchError } = await supabase
    .from('forms')
    .select('*')
    .eq('slug', formSlug)
    .eq('user_id', userId)
    .single()

  if (fetchError || !originalForm) {
    return { form: null, error: fetchError?.message || 'Форму не знайдено' }
  }

  // Генеруємо новий slug
  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    const code = nanoid(6)
    const slug = `form-${code}`
    const name = `${originalForm.name} (копія)`
    
    const { data, error } = await supabase
      .from('forms')
      .insert({
        user_id: userId,
        slug: slug,
        name: name,
        // Копіюємо всі інші поля, крім id, created_at, slug, name
        description: originalForm.description,
        settings: originalForm.settings,
        fields: originalForm.fields,
        enabled: originalForm.enabled,
        // Додайте інші поля, які потрібно скопіювати
      })
      .select()
      .single()
    
    if (!error) {
      return { form: data, error: null }
    }
    
    if (error.code === '23505') {
      attempts++
      continue
    }
    
    return { form: null, error: error.message }
  }
  
  return { form: null, error: 'Не вдалося згенерувати унікальну назву' }
}

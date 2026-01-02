// app/sitemap

import { createClient } from '@/utils/supabase/server'
import { BASE_URL } from '@/constants'
import { getAllPublicFormsSlugs } from '@/server/action'

export default async function sitemap() {
  const supabase = await createClient()

  const { forms, error } = await getAllPublicFormsSlugs(supabase)

  let formsObjects = []

  if (!error && forms) {
    formsObjects = forms.map(form => ({
      url: `${BASE_URL}/${form.slug}`,
      lastModified: new Date(form?.created_at),
      changeFrequency: 'weekly',
      priority: 0.8
    }))
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    // {
    //   url: `${BASE_URL}/create`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8
    // },
    ...formsObjects
  ]
}

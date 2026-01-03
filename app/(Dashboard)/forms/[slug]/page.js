// app/(Dashboard)/forms/[slug]/page

import { createClient } from '@/utils/supabase/server'
import { getForm } from '@/server/action'
import { Builder } from '@/components/form-builder/Builder';

export default async function DashboardForm({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { form, error } = await getForm(supabase, slug)

  return <Builder form={form} />;
}

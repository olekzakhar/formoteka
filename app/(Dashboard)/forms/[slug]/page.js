import { createClient } from '@/utils/supabase/server'
import { getForm } from '@/server/action'
import { FormBuilder } from '@/components/form-builder/FormBuilder';

export default async function DashboardForm({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { form, error } = await getForm(supabase, slug)

  return <FormBuilder form={form} />;
}

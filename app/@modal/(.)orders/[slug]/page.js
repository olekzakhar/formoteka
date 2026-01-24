// app/@modal/(.)orders/[slug]/page

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getForm } from '@/server/action'
import OrdersList from '@/components/orders/List'
import OrdersModalWrapper from './modal-wrapper'

export default async function OrdersModal({ params }) {
  const { slug } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { form, error } = await getForm(supabase, slug)

  if (error || !form) {
    // Можна додати обробку помилки
    return (
      <OrdersModalWrapper>
        <div className="p-8 text-center text-gray-500">
          Форму не знайдено
        </div>
      </OrdersModalWrapper>
    )
  }

  return (
    <OrdersModalWrapper>
      <OrdersList name={form?.name} />
    </OrdersModalWrapper>
  )
}

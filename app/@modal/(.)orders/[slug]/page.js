// app/@modal/(.)orders/[slug]/page

import { use } from 'react'
import OrdersList from '@/components/orders/List'
import OrdersModalWrapper from './modal-wrapper'

export default function OrdersModal({ params }) {
  const { slug } = use(params)

  return (
    <OrdersModalWrapper>
      <OrdersList slug={slug} />
    </OrdersModalWrapper>
  )
}

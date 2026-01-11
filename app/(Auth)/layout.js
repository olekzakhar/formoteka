// app/(Auth)/layout

import { Toaster } from 'sonner'

export default function AuthLayout({ children }) {
  return (
    <>
      <Toaster
        richColors
        theme='light'
        expand={false} />
      {children}
    </>
  )
}

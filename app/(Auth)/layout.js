// app/(Auth)/layout

import { Toaster } from 'sonner'
import "./auth.css";

export default function AuthLayout({ children }) {
  return (
    <div data-theme="auth">
      <Toaster
        richColors
        theme='light'
        expand={false} />
      {children}
    </div>
  )
}

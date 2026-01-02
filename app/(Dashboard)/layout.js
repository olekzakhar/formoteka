// app/(dashboard)/layout

import "./dashboard.css";
import { Toaster } from 'sonner'

export default function DashboardLayout({ children }) {
  return (
    <div data-theme="dashboard">
      <Toaster
        richColors
        theme='light'
        expand={false} />
      {children}
    </div>
  )
}

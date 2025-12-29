// app/(dashboard)/layout

import "./dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <div data-theme="dashboard">
      {children}
    </div>
  )
}

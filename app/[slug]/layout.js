// app/[slug]/layout

import './slug.css'

export default function SlugLayout({ children }) {
  return (
    <div data-theme="slug">
      {children}
    </div>
  )
}

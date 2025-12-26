// components/FormCard.js
'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { BASE_URL, FORMS_PATH } from '@/constants'
import { useRouter } from 'next/navigation'

export default function FormCard({ form }) {
  const router = useRouter()

  const handleCardClick = (e) => {
    // Only navigate if the click wasn't on the external link
    if (!e.target.closest('.external-link')) {
      router.push(`${FORMS_PATH}/${form.slug}`)
    }
  }

  return (
    <div 
      className="group bg-[#F3F4F5] border border-[#E8E8E8] rounded-2xl p-4 cursor-pointer hover:bg-[#E8E8E8] transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="font-medium">{form?.name}</div>
          <Link 
            href={`${BASE_URL}/${form?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1"
          >
            {BASE_URL}/{form?.slug}
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <span className="text-gray-600 group-hover:text-gray-900">Edit</span>
      </div>
    </div>
  )
}

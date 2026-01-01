// app/@modal/(.)orders/[slug]/modal-wrapper

'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function OrdersModalWrapper({ children }) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/55"
        onClick={() => router.back()}
      />
      
      {/* Modal content */}
      <div className="mx-4 mt-[5.2%] p-6 pb-8 relative w-full max-w-[700px] bg-white/95 rounded-3xl shadow-lg">
        <button 
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  )
}

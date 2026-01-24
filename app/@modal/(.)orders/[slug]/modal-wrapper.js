// app/@modal/(.)orders/[slug]/modal-wrapper

'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function OrdersModalWrapper({ children }) {
  const router = useRouter()

  return (
    <div className="fixed px-2 inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/55"
        onClick={() => router.back()}
      />
      
      {/* Modal content */}
      <div className="mx-4 mt-[5.2%] pt-5 pb-8 relative w-full max-w-[1200px] bg-white/95 rounded-3xl shadow-lg">
        {/* <button 
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Закрити"
        >
          <X className="w-6 h-6" />
        </button> */}

        <button
          onClick={() => router.back()}
          className="absolute top-3.5 right-4 p-2 h-8 bg-gray-200/60 hover:bg-gray-200/80 text-gray-500 hover:text-gray-600 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

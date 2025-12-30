'use client'

import { useState, useRef, useEffect } from 'react'
import LogoutButton from '@/components/LogoutButton'

export default function UserMenu({ userEmail }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-medium hover:shadow-md transition-shadow"
      >
        {userEmail?.[0]?.toUpperCase() || 'U'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-500 mb-0.5 uppercase">Акаунт</p>
            <p className="text-sm font-medium text-gray-800 truncate">{userEmail}</p>
          </div>
          
          <div className="px-1 py-2">
            <LogoutButton onSignOut={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ExternalLink, Pencil, MoreVertical, Copy, Trash2 } from 'lucide-react'
import { BASE_URL, FORMS_PATH } from '@/constants'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function FormCard({ form }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleDuplicate = () => {
    // Add your duplicate logic here
    console.log('Duplicate form:', form.slug)
    setIsMenuOpen(false)
  }

  const handleDelete = () => {
    // Add your delete logic here
    console.log('Delete form:', form.slug)
    setIsMenuOpen(false)
  }

  return (
    <div
      className="
        relative pl-8 pr-4 py-5 block
        bg-card rounded-lg
        transition-smooth
        hover:bg-card/45
        hover:ring-1 hover:ring-block-hover/30
        shadow-sm
      "
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="text-lg font-medium">{form?.name}</div>

          <div className="relative inline-block group">
            <Link
              href={`${BASE_URL}/${form?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center
                text-sm text-black/60
                hover:text-black/80
                mt-1
                transition-smooth
              "
            >
              {BASE_URL}/{form?.slug}
            </Link>
            
            <ExternalLink 
              className="
                w-[13px] h-[13px] 
                absolute 
                left-[calc(100%+4px)] 
                top-[7px]
                transition-opacity
                duration-200
                pointer-events-none
                z-10
                opacity-0
                group-hover:opacity-100
              "
            />
          </div>
        </div>

        <div className="-mt-2 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mr-2 text-sm z-10">1 Заявка</div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#2F3032] text-[#FAFAFA] rounded-[5px] py-1 px-2 text-xs">
                <p>Кількість отриманих заявок</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* pencil button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="
                    text-gray-600
                    transition-colors
                    hover:text-gray-900
                    relative z-10
                  "
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="
                      transition-colors
                      duration-400
                      ease-out
                      hover:bg-muted
                      hover:text-gray-900
                    "
                  >
                    <Link href={`${FORMS_PATH}/${form.slug}`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-[#2F3032] text-[#FAFAFA] rounded-[5px] py-1 px-2 text-xs">
                <p>Редагувати форму</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* three dots menu */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                text-gray-600
                transition-colors
                duration-400
                ease-out
                hover:bg-muted
                hover:text-gray-900
                relative z-10
                cursor-pointer
                ${isMenuOpen ? 'bg-muted text-gray-900' : ''}
              `}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="py-1">
                  <button
                    onClick={handleDuplicate}
                    className="
                      w-full flex items-center gap-3 px-4 py-2
                      text-sm text-gray-700
                      hover:bg-gray-50
                      transition-colors
                    "
                  >
                    <Copy className="w-4 h-4" />
                    <span>Дублювати</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="
                      w-full flex items-center gap-3 px-4 py-2
                      text-sm text-red-600
                      hover:bg-red-50
                      transition-colors
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Видалити</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

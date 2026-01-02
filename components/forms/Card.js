// components/forms/Card

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { ExternalLink, SquarePen, MoreVertical, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BASE_URL, FORMS_PATH } from '@/constants'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { duplicateForm, deleteForm } from '@/server/action'
import { timeAgo, pluralize } from '@/utils'

export default function FormCard({ form, userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const menuRef = useRef(null)
  const router = useRouter()
  const supabase = createClient()

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


  const handleDuplicate = async () => {
    setIsDuplicating(true)
    
    try {
      const { form: newForm, error } = await duplicateForm(supabase, form.slug, userId)
      
      if (error) {
        // console.error('Помилка дублювання форми:', error)
        // alert(`Не вдалося дублювати форму: ${error}`)
        alert(`Не вдалося дублювати форму`)
      } else {
        router.refresh()
      }
    } catch (err) {
      // console.error('Помилка:', err)
      alert('Сталася помилка при дублюванні форми')
    } finally {
      setIsDuplicating(false)
      toast.success('Копію створено')
    }

    setIsMenuOpen(false)
  }


  const handleDelete = async () => {
    const confirmed = confirm(`Видалити форму "${form?.name}"? Цю дію неможливо скасувати. Усі заявки буде видалено.`)
    
    if (!confirmed) return
    
    setIsDeleting(true)
    
    try {
      const { success, error } = await deleteForm(supabase, form.slug, userId)
      
      if (error) {
        // console.error('Помилка видалення форми:', error)
        // alert(`Не вдалося видалити форму: ${error}`)
        alert(`Не вдалося видалити форму`)
      } else {
        router.refresh()
      }
    } catch (err) {
      // console.error('Помилка:', err)
      alert('Сталася помилка при видаленні форми')
    } finally {
      setIsDeleting(false)
    }

    setIsMenuOpen(false)
    toast.success('Видалено')
  }

  return (
    <div
      className="relative pl-8 pr-4 py-5 block bg-card rounded-lg hover:bg-card/50 hover:ring-1 hover:ring-block-hover/30
        shadow-sm hover:shadow-md transition-smooth">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="-mb-0.5 text-xl font-medium">{form?.name}</div>

          {/* <div className="relative inline-block group">
            <Link
              href={`${BASE_URL}/${form?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-black/60 hover:text-black/80 transition-smooth"
            >
              {BASE_URL}/{form?.slug}
            </Link>
            
            <ExternalLink 
              className="absolute top-[7px] left-[calc(100%+4px)] w-[13px] h-[13px] opacity-0 group-hover:opacity-100
                z-10 pointer-events-none transition-opacity duration-200" />
          </div> */}

          <div className="mt-1.5 flex items-center gap-[18px]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {form?.order_count
                    ? <Link
                        href={`${BASE_URL}/orders/${form?.slug}`}
                        className="flex items-center gap-1.5 w-fit text-[#1a1a1a] text-sm font-semibold hover:text-[#0B7F58] transition-smooth"
                      >
                        <span className="inline-block w-2 h-2 rounded-full bg-[#10b981]"></span>
                        <span>{pluralize(form?.order_count)}</span>
                      </Link>
                    : <div className="flex items-center gap-1.5 w-fit text-[#6b7280] text-sm font-medium">
                        <span>Заявок ще немає</span>
                      </div>
                  }
                </TooltipTrigger>
                <TooltipContent className="bg-[#2F3032] text-[#FAFAFA] rounded-[5px] py-1 px-2 text-xs">
                  <p>Кількість отриманих заявок</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* <div className="mt-0.5 text-[13px] text-[#6b7280]">Остання 15 хвилин тому</div> */}
            {form?.order_count && form?.last_order_at
              ? <div className="mt-0.5 text-[13px] text-[#6b7280]">
                  Остання {timeAgo(form?.last_order_at)}
                </div>
              : <></>
            }
          </div>
        </div>

        <div className="-mt-2 flex items-center">
          <Button
            variant="secondary"
            asChild
            className="mr-2 px-4 py-1.5 h-[36px] rounded-tr-lg flex items-center gap-[8px] text-sm font-medium"
          >
            <Link
              href={`${BASE_URL}/${form?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Переглянути
              <ExternalLink className="w-[13px] h-[13px]" />
            </Link>
          </Button>

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
                    asChild
                    className="
                      transition-colors
                      duration-400
                      ease-out
                      hover:bg-muted
                      hover:text-gray-900
                    "
                  >
                    <Link href={`${FORMS_PATH}/${form.slug}`}>
                      <SquarePen className="w-[17px]! h-[17px]!" />
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
              <MoreVertical className="w-[17px]! h-[17px]!" />
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="py-1">
                  <button
                    onClick={handleDuplicate}
                    disabled={isDuplicating}
                    className="px-4 py-2 flex items-center gap-3 w-full text-sm text-gray-700 hover:bg-gray-50
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{isDuplicating ? 'Дублювання...' : 'Дублювати'}</span>
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 flex items-center gap-3 w-full text-sm text-red-600 hover:bg-red-50
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleting ? 'Видалення...' : 'Видалити'}</span>
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

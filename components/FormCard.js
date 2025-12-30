'use client'

import Link from 'next/link'
import { ExternalLink, Pencil } from 'lucide-react'
import { BASE_URL, FORMS_PATH } from '@/constants'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function FormCard({ form }) {
  return (
    <div
      className="
        relative pl-8 pr-6 py-5 block
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

        <div className="-mt-2 flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm z-10">1 Заявка</div>
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
        </div>
      </div>
    </div>
  )
}

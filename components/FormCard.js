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
        group
        bg-card rounded-lg
        transition-smooth
        hover:ring-1 hover:ring-block-hover
        shadow-soft
      "
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="font-medium">{form?.name}</div>

          {/* absolute overlay link */}
          <Link
            href={`${FORMS_PATH}/${form.slug}`}
            className="absolute inset-0 rounded-lg"
          />

          <Link
            href={`${BASE_URL}/${form?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              relative z-10
              inline-flex items-center gap-1
              text-sm text-blue-600
              hover:text-blue-800 hover:underline
              mt-1
            "
          >
            {BASE_URL}/{form?.slug}
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="-mt-2 flex items-center gap-4">
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
                    group-hover:text-gray-900
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
                      group-hover:bg-muted
                      group-hover:text-gray-900
                    "
                  >
                    <Pencil className="w-4 h-4" />
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

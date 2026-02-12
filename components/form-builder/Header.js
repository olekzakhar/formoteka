// components/form-builder/Header

import Link from 'next/link'
import {
  ArrowLeft,
  Play,
  Link as LinkIcon,
  ExternalLink,
  Loader2,
  CheckCheck,
  FileCheckCorner,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import { BASE_URL, FORMS_PATH } from '@/constants'
import Logo from '@/components/Logo'
import { cn } from '@/utils'

export const Header = ({
  formSlug,
  formName,
  setFormName,
  onTogglePreview,
  isSaving,
  lastSaved,
  hasUnsavedChanges,
  onManualSave
}) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setFormName(formName)
  }, [formName, setFormName])

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditingName])

  const handleSaveName = () => {
    const trimFormName = formName.trim()
    if (trimFormName) {
      setFormName(trimFormName)
    }

    setIsEditingName(false);
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${BASE_URL}/${formSlug}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <header className="h-[52px] border-b border-border bg-card rounded-b-3xl flex items-center px-5 shrink-0 bg-transparent">
      {/* Left section - Back button and form name */}
      <div className="flex items-center gap-2 w-[200px]">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          title="Повернутись назад"
        >
          <Link
            href={FORMS_PATH}
            className="h-8 w-8 flex justify-center items-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        
        <div className="flex flex-col min-w-0 flex-1">
          {isEditingName ? (
            <input
              ref={inputRef}
              type="text"
              value={formName}
              className="text-sm font-medium text-foreground bg-transparent outline-none w-full px-0 border-0 m-0"
              onChange={(e) => setFormName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') {
                  setFormName(formName);
                  setIsEditingName(false);
                }
              }}
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-sm font-medium text-foreground hover:text-black/60 transition-smooth truncate text-left w-full px-0 border-0 m-0"
            >
              {formName}
            </button>
          )}
        </div>
      </div>
      
      {/* Logo */}
      <Link
        href={`${BASE_URL}${FORMS_PATH}`}
        className="-mt-0.5 absolute left-1/2 -translate-x-1/2 text-[#14171F]"
      >
        <Logo />
      </Link>

      {/* Right section - Action buttons */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Save status indicator */}
        {isSaving ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Збереження...</span>
          </div>
        ) : lastSaved && !hasUnsavedChanges ? (
          <div className="flex items-center gap-1.5 text-green-600">
            <CheckCheck className="h-3.5 w-3.5" />
            <span className="text-xs">Збережено</span>
          </div>
        ) : null}

        {/* Manual Save Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onManualSave}
          disabled={!hasUnsavedChanges || isSaving}
          className={cn(
            "mr-1.5 h-8 gap-1.5",
            !hasUnsavedChanges && "opacity-50 cursor-not-allowed"
          )}
          title={hasUnsavedChanges ? "Save changes" : "No changes to save"}
        >
          <FileCheckCorner className="h-3.5 w-3.5" />
          <span className="text-xs">Зберегти</span>
        </Button>

        <div className="w-px h-5 bg-border" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePreview}
          className="h-8 w-8"
          title="Перегляд"
        >
          <Play className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyUrl}
          className="h-8 w-8 transition-colors"
          title={isCopied ? "Скопійовано!" : "Копіювати посилання"}
        >
          {isCopied
            ? <Check className="h-4 w-4" />
            : <LinkIcon className="h-4 w-4" />
          }
        </Button>

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Відкрити у новій вкладці"
        >
          <Link href={`${BASE_URL}/${formSlug}`} target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  )
}

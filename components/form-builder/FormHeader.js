import Link from 'next/link';
import { ArrowLeft, Play, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { FORMS_PATH } from '@/constants';

export const FormHeader = ({ formName, onTogglePreview }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editValue, setEditValue] = useState(formName);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(formName);
  }, [formName]);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName]);

  const handleSaveName = () => {
    if (editValue.trim()) {
      // onFormNameChange(editValue.trim());
    } else {
      setEditValue(formName);
    }
    setIsEditingName(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleOpenInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <header className="h-[52px] border-b border-border bg-card rounded-b-3xl flex items-center px-4 shrink-0 bg-transparent">
      {/* Left section - Back button and form name - fixed width */}
      <div className="flex items-center gap-2 w-[200px]">
        <Link
          href={FORMS_PATH}
          className="h-8 w-8 flex justify-center items-center hover:bg-accent hover:text-accent-foreground
            rounded-md text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        
        {isEditingName ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveName();
              if (e.key === 'Escape') {
                setEditValue(formName);
                setIsEditingName(false);
              }
            }}
            className="text-sm font-medium text-foreground bg-transparent border-b-2 border-primary outline-none px-1 min-w-0"
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="text-sm font-medium text-foreground hover:text-primary transition-smooth truncate"
          >
            {formName}
          </button>
        )}
      </div>
      
      {/* Center - Brand name - absolute positioned to stay centered */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-lg font-semibold text-foreground">Formoteka</span>
      </div>

      {/* Right section - Action buttons - fixed width */}
      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePreview}
          className="h-8 w-8"
          title="Preview"
        >
          <Play className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyUrl}
          className="h-8 w-8"
          title="Copy URL"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenInNewTab}
          className="h-8 w-8"
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

// components/form-builder/Preview

'use client'

import Link from 'next/link';
import { X, Monitor, Smartphone, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils';
import { BASE_URL } from '@/constants';
import { FormRenderer } from '@/components/form-builder/FormRenderer';

export const Preview = ({
  blocks,
  successBlocks,
  submitButtonText,
  formDesign,
  formSlug = 'form',
  formName = '',
  onClose,
}) => {
  const [previewMode, setPreviewMode] = useState('desktop');
  
  const formUrl = `${BASE_URL}/${formSlug}`;
  const displayUrl = formUrl.replace(/^https?:\/\//, '');

  const handleSubmitSuccess = (data) => {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           DATABASE SAVE DATA - FORM CONFIGURATION              ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log('║ This is the form structure that should be saved to the         ║');
    console.log('║ "forms" table in the database:                                 ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log(JSON.stringify(data.formConfiguration, null, 2));
    
    console.log('\n');
    
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           DATABASE SAVE DATA - FORM SUBMISSION                 ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log('║ This is the user submission that should be saved to the        ║');
    console.log('║ "form_submissions" table in the database:                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log(JSON.stringify(data.submissionData, null, 2));
  };

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50" />

      {/* Content */}
      <div className="relative h-full w-full flex items-center justify-center p-8">
        <div 
          className={cn(
            "flex flex-col transition-all duration-300",
            previewMode === 'mobile' 
              ? 'w-[375px] max-w-[375px]' 
              : 'w-[70vw] max-w-[960px] min-w-[320px]'
          )}
          style={{ height: 'calc(100vh - 64px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal container */}
          <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl h-full relative">
            {/* Top bar */}
            <div className="bg-[#F3F4F6] px-4 py-2.5 flex items-center justify-between border-b border-border gap-3">
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                aria-label="Close preview"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              
              {/* Preview Mode Toggle */}
              <div className="inline-flex bg-background/50 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    previewMode === 'desktop'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title="Desktop view"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    previewMode === 'mobile'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title="Mobile view"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <Link
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {displayUrl}
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Form content */}
            <div className="flex-1 overflow-auto">
              <FormRenderer
                blocks={blocks}
                successBlocks={successBlocks}
                submitButtonText={submitButtonText}
                formDesign={formDesign}
                formSlug={formSlug}
                formName={formName}
                isPreview={true}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

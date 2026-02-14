// components/form-builder/BlocksEditor

'use client'

import { blockDefinitions } from '@/data/block-definitions';
import {
  Copy,
  Trash2,
  Image,
  Image as ImageIcon,
  Loader2,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  ChevronDown as ArrowDown
} from 'lucide-react';
import { cn, getImageUrl, getColor, dateChange } from '@/utils';
import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { BlockSlideshow } from '@/components/form-builder/block/Slideshow';
import { BlockReviews } from '@/components/form-builder/block/Reviews';
import { BlockFAQ } from '@/components/form-builder/block/FAQ';
import { BlockMap } from '@/components/form-builder/block/Map';
import { BlockIcon } from '@/components/form-builder/block/Icon';
import { BlockAvatar } from '@/components/form-builder/block/Avatar';
import { BlockMessengerSelect } from '@/components/form-builder/block/MessengerSelect';
import { BlockList } from '@/components/form-builder/block/List';
import { BlockChoiceCard } from '@/components/form-builder/block/ChoiceCard';
import { DatePicker } from '@/components/ui/DatePicker'

export const BlocksEditor = ({
  block,
  blockIndex,
  totalBlocks,
  isActive,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onOpenSettings,
  onAddBlock,
  onUpdateBlock,
  headingColor = '#131720', // text-foreground 
  headingSize = '20px',
  inputColor,
  inputBgColor,
  inputTextColor,
  formTextColor,
  accentColor,
}) => {
  const definition = blockDefinitions.find((d) => d.type === block.type)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [isEditingPlaceholder, setIsEditingPlaceholder] = useState(false)
  const [editLabelValue, setEditLabelValue] = useState(block.label ?? '')
  const [editPlaceholderValue, setEditPlaceholderValue] = useState(block.placeholder ?? '')
  const [uploadingImages, setUploadingImages] = useState(new Set())
  const [dateValues, setDateValues] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const labelInputRef = useRef(null)
  const placeholderInputRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const showLabel = block.showLabel !== false;

  useEffect(() => {
    setEditLabelValue(block.label);
    setEditPlaceholderValue(block.placeholder || '');
  }, [block.label, block.placeholder]);

  // Auto-resize textarea for paragraph
  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    // Use `auto` to shrink first, then grow to exact scrollHeight (no extra empty space)
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (isEditingLabel) {
      if (block.type === 'paragraph' && textareaRef.current) {
        textareaRef.current.focus();
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
        autoResizeTextarea();
      } else if (labelInputRef.current) {
        labelInputRef.current.focus();
        const len = labelInputRef.current.value.length;
        labelInputRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditingLabel, block.type]);

  useEffect(() => {
    if (isEditingPlaceholder && placeholderInputRef.current) {
      placeholderInputRef.current.focus();
      const len = placeholderInputRef.current.value.length;
      placeholderInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditingPlaceholder]);

  const handleSaveLabel = () => {
    if (editLabelValue.trim() !== block.label) {
      onUpdateBlock({ label: editLabelValue.trim() || block.label });
    }
    setIsEditingLabel(false);
  };

  const handleSavePlaceholder = () => {
    if (editPlaceholderValue !== block.placeholder) {
      onUpdateBlock({ placeholder: editPlaceholderValue });
    }
    setIsEditingPlaceholder(false);
  };

  const handleLabelKeyDown = (e) => {
    if (e.key === 'Enter' && block.type !== 'paragraph') {
      e.preventDefault();
      handleSaveLabel();
    }
    if (e.key === 'Escape') {
      setEditLabelValue(block.label);
      setIsEditingLabel(false);
    }
  };

  const handlePlaceholderKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSavePlaceholder();
    }
    if (e.key === 'Escape') {
      setEditPlaceholderValue(block.placeholder || '');
      setIsEditingPlaceholder(false);
    }
  };

  const handleImageUpload = async (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const images = [...(block.images || [])];
      const oldFileName = images[index]; // Зберігаємо старе ім'я файлу для видалення

      try {
        // СПОЧАТКУ створюємо preview і показуємо його
        const reader = new FileReader();
        
        // Використовуємо Promise щоб чекати завершення читання
        const previewDataUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Тепер показуємо preview (це data URL, відобразиться миттєво)
        const updatedImagesWithPreview = [...(block.images || [])];
        updatedImagesWithPreview[index] = previewDataUrl;
        onUpdateBlock({ images: updatedImagesWithPreview });

        // Додаємо індекс до списку завантажуваних (показуємо loader)
        setUploadingImages(prev => new Set(prev).add(index));

        // Тепер завантажуємо в R2 у фоні
        const formData = new FormData();
        formData.append('file', file);
        
        // Якщо є старе зображення, передаємо тільки ім'я файлу для видалення
        if (oldFileName && !oldFileName.startsWith('data:')) {
          formData.append('oldFileName', oldFileName);
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Помилка завантаження');
        }

        const data = await response.json();

        // Зберігаємо ТІЛЬКИ ім'я файлу, а не URL
        const updatedImages = [...(block.images || [])];
        updatedImages[index] = data.fileName;
        onUpdateBlock({ images: updatedImages });

      } catch (error) {
        console.error('Помилка завантаження:', error);
        // Повертаємо старе зображення при помилці
        const revertImages = [...(block.images || [])];
        revertImages[index] = oldFileName;
        onUpdateBlock({ images: revertImages });
        alert('Помилка завантаження зображення. Спробуйте ще раз.');
      } finally {
        // Видаляємо індекс зі списку завантажуваних
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }
    };
    input.click();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = (e) => {
    e.stopPropagation()
    onDelete()
    setShowDeleteConfirm(false)
  }

  const handleDeleteCancel = (e) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
  }

  const renderImageGrid = () => {
    const count = block.imageCount || 1;
    const images = block.images || [];
    const positions = block.imagePositions || [];
    const fit = block.imageFit || 'cover';
    const align = block.imageAlign || 'center';
    const radius = block.imageRadius || 'small';
    
    const gridClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-2',
      5: 'grid-cols-3',
    }[count];

    const alignClass = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    }[align];

    const radiusClass = {
      none: 'rounded-none',
      small: 'rounded-lg',
      medium: 'rounded-2xl',
      full: 'rounded-[2rem]',
    }[radius];

    return (
      <div className={cn('grid gap-3', gridClass)}>
        {Array.from({ length: count }).map((_, i) => {
          const hasImage = Boolean(images[i]);
          const isUploading = uploadingImages.has(i);
          const pos = positions[i] || { x: 50, y: 50 };

          return (
            <div
              key={i}
              className={cn(
                'aspect-video overflow-hidden relative group',
                radiusClass,
                hasImage
                  ? ''
                  : 'border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2',
                'transition-smooth'
              )}
            >
              {hasImage ? (
                <>
                  <div className={cn('w-full h-full flex', alignClass)}>
                    <img
                      src={getImageUrl(images[i])}
                      alt={`Uploaded form image ${i + 1}`}
                      className={cn(
                        fit === 'cover' ? 'w-full h-full object-cover' : 'h-full object-contain',
                        fit === 'contain' && radiusClass,
                        isUploading && 'opacity-50'
                      )}
                      style={fit === 'cover' ? { objectPosition: `${pos.x}% ${pos.y}%` } : undefined}
                      draggable={false}
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay при завантаженні */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}

                  {/* Кнопка заміни зображення */}
                  {!isUploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageUpload(i);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 hover:bg-background text-foreground opacity-0 group-hover:opacity-100 transition-smooth shadow-sm"
                      title="Change image"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageUpload(i);
                  }}
                  className="flex flex-col items-center justify-center gap-2 w-full h-full hover:border-primary/50 hover:bg-muted/50 transition-smooth"
                >
                  <Image className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Click to upload</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'divider':
        return (
          <div 
            className="w-full flex justify-center py-2"
          >
            <hr
              className="border-0"
              style={{
                width: `${block.dividerWidth || 100}%`,
                height: `${block.dividerThickness || 1}px`,
                backgroundColor: block.dividerStyle === 'solid' ? (block.dividerColor || '#e5e7eb') : 'transparent',
                backgroundImage: block.dividerStyle === 'dashed' 
                  ? `repeating-linear-gradient(to right, ${block.dividerColor || '#e5e7eb'} 0, ${block.dividerColor || '#e5e7eb'} 8px, transparent 8px, transparent 14px)`
                  : block.dividerStyle === 'dotted'
                    ? `repeating-linear-gradient(to right, ${block.dividerColor || '#e5e7eb'} 0, ${block.dividerColor || '#e5e7eb'} ${(block.dividerThickness || 1) * 2}px, transparent ${(block.dividerThickness || 1) * 2}px, transparent ${(block.dividerThickness || 1) * 4}px)`
                    : 'none',
                borderRadius: block.dividerStyle === 'dotted' ? `${(block.dividerThickness || 1) / 2}px` : '0',
              }}
            />
          </div>
        )


      case 'spacer':
        return (
          <div 
            className="w-full bg-muted/30 border border-dashed border-border rounded flex items-center justify-center text-xs text-muted-foreground"
            style={{ height: `${block.height || 32}px` }}
          >
            Spacer ({block.height || 32}px)
          </div>
        )


      case 'image':
        return renderImageGrid()


      case 'slideshow':
        return <BlockSlideshow block={block} onUpdateBlock={onUpdateBlock} />


      case 'reviews':
        return <BlockReviews block={block} onUpdateBlock={onUpdateBlock} />


      case 'faq':
        return <BlockFAQ block={block} onUpdateBlock={onUpdateBlock} />


      case 'map':
        return <BlockMap block={block} onUpdateBlock={onUpdateBlock} onRequestSelect={onSelect} />


      case 'icon':
        return <BlockIcon block={block} />


      case 'list':
        return <BlockList block={block} onUpdateBlock={onUpdateBlock} isEditable />


      case 'avatar':
        const hasAvatarImage = Boolean(block.avatarImage);
        return (
          <div className="relative group/avatar">
            <BlockAvatar block={block} />
            {/* Upload button overlay - only show when no image */}
            {!hasAvatarImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (ev) => {
                    const file = (ev.target).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        onUpdateBlock({ avatarImage: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10',
                  'p-2 rounded-full bg-background/90 border border-border shadow-md',
                  'text-muted-foreground hover:text-foreground hover:bg-background',
                  'opacity-0 group-hover/avatar:opacity-100 transition-smooth'
                )}
                title="Upload image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )


      case 'heading':
        return isEditingLabel
          ? <input
              ref={labelInputRef}
              type="text"
              value={editLabelValue}
              onChange={(e) => setEditLabelValue(e.target.value)}
              onBlur={handleSaveLabel}
              onKeyDown={handleLabelKeyDown}
              className="font-semibold bg-transparent outline-none w-full"
              style={{
                color: headingColor,
                fontSize: headingSize,
                textAlign: block.textAlign
              }}
            />
          : <h3
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
                setIsEditingLabel(true);
              }}
              className="font-semibold cursor-text"
              style={{
                color: headingColor,
                fontSize: headingSize,
                textAlign: block.textAlign
              }}
            >
              {block.label}
            </h3>


      case 'paragraph':
        return isEditingLabel
          ? <textarea
              ref={textareaRef}
              rows={1}
              value={editLabelValue}
              onChange={(e) => {
                setEditLabelValue(e.target.value);
                autoResizeTextarea();
              }}
              onFocus={autoResizeTextarea}
              onBlur={handleSaveLabel}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setEditLabelValue(block.label);
                  setIsEditingLabel(false);
                }
              }}
              className="bg-transparent outline-none w-full resize-none overflow-hidden block
                         leading-normal p-0 m-0 whitespace-pre-wrap break-words"
              style={{
                lineHeight: '1.5',
                textAlign: block.textAlign
              }}
            />
          : <p
              className="cursor-text whitespace-pre-wrap break-words"
              style={{ textAlign: block.textAlign }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
                setIsEditingLabel(true);
              }}
            >
              {block.label}
            </p>


      case 'short-text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel
                ? <input
                    ref={labelInputRef}
                    type="text"
                    value={editLabelValue}
                    onChange={(e) => setEditLabelValue(e.target.value)}
                    onBlur={handleSaveLabel}
                    onKeyDown={handleLabelKeyDown}
                    className="block text-sm font-medium bg-transparent outline-none w-full p-0 border-0 leading-5"
                  />
                : <Label
                    className="cursor-text"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect()
                      setIsEditingLabel(true)
                    }}
                  >
                    {block.label}
                    {block.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
            )}

            {isEditingPlaceholder
              ? <Input
                  ref={placeholderInputRef}
                  type="text"
                  className="max-w-[300px]"
                  value={editPlaceholderValue}
                  onChange={(e) => setEditPlaceholderValue(e.target.value)}
                  onBlur={handleSavePlaceholder}
                  onKeyDown={handlePlaceholderKeyDown}
                  style={{ 
                    borderColor: inputColor || undefined, 
                    backgroundColor: inputBgColor ? inputBgColor : undefined,
                    color: inputTextColor || undefined,
                    '--placeholder-color': getColor(inputTextColor) || undefined,
                    '--focus-ring-color': getColor(accentColor, 0.6) || undefined
                  }}
                />
              : <Input
                  type="text"
                  className="max-w-[300px]"
                  value=""
                  placeholder={block.placeholder}
                  style={{ 
                    borderColor: inputColor || undefined, 
                    backgroundColor: inputBgColor ? inputBgColor : undefined,
                    color: inputTextColor || undefined,
                    '--placeholder-color': getColor(inputTextColor) || undefined,
                    '--focus-ring-color': getColor(accentColor, 0.6) || undefined
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingPlaceholder(true);
                  }}
                  readOnly
                />
            }
          </div>
        )

      case 'date':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel
                ? <input
                    ref={labelInputRef}
                    type="text"
                    value={editLabelValue}
                    onChange={(e) => setEditLabelValue(e.target.value)}
                    onBlur={handleSaveLabel}
                    onKeyDown={handleLabelKeyDown}
                    className="block text-sm font-medium bg-transparent outline-none w-full p-0 border-0 leading-5"
                  />
                : <Label
                    className="cursor-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect();
                      setIsEditingLabel(true);
                    }}
                  >
                    {block.label}
                    {block.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
            )}

            {isEditingPlaceholder
              ? <div className="relative max-w-[300px]">
                  <Input
                    ref={placeholderInputRef}
                    type="text"
                    className="h-[42px] pr-10 pt-[7px]"
                    value={editPlaceholderValue}
                    onChange={(e) => setEditPlaceholderValue(e.target.value)}
                    onBlur={handleSavePlaceholder}
                    onKeyDown={handlePlaceholderKeyDown}
                    style={{ 
                      borderColor: inputColor || undefined, 
                      backgroundColor: inputBgColor || undefined,
                      color: inputTextColor || undefined,
                      '--placeholder-color': getColor(inputTextColor) || undefined,
                      '--focus-ring-color': getColor(accentColor, 0.6) || undefined
                    }}
                  />
                  <CalendarIcon 
                    className="absolute right-[13px] top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-90 pointer-events-none" 
                    style={{ color: inputTextColor || 'currentColor' }}
                  />
                </div>
              : <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingPlaceholder(true);
                  }}
                  className="max-w-[300px] cursor-text"
                >
                  <DatePicker
                    className="w-full pointer-events-none"
                    value={dateValues[block.id]}
                    onChange={(date) => dateChange(block.id, date, setDateValues)}
                    placeholder={block?.placeholder}
                    inputColor={inputColor}
                    inputBgColor={inputBgColor}
                    inputTextColor={inputTextColor}
                    accentColor={accentColor}
                  />
                </div>
            }
          </div>
        )


      case 'long-text':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel
                ? <input
                    ref={labelInputRef}
                    type="text"
                    value={editLabelValue}
                    onChange={(e) => setEditLabelValue(e.target.value)}
                    onBlur={handleSaveLabel}
                    onKeyDown={handleLabelKeyDown}
                    className="block text-sm font-medium bg-transparent outline-none w-full p-0 border-0 leading-5"
                  />
                : <Label
                    className="cursor-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect();
                      setIsEditingLabel(true);
                    }}
                  >
                    {block.label}
                    {block.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
            )}

            {isEditingPlaceholder
              ? <Textarea
                  ref={placeholderInputRef}
                  className="resize-none"
                  value={editPlaceholderValue}
                  onChange={(e) => setEditPlaceholderValue(e.target.value)}
                  onBlur={handleSavePlaceholder}
                  onKeyDown={handlePlaceholderKeyDown}
                  style={{ 
                    borderColor: inputColor || undefined, 
                    backgroundColor: inputBgColor ? inputBgColor : undefined,
                    color: inputTextColor || undefined,
                    '--placeholder-color': getColor(inputTextColor) || undefined,
                    '--focus-ring-color': getColor(accentColor, 0.6) || undefined
                  }}
                />
              : <Textarea
                  placeholder={block.placeholder}
                  className="resize-none"
                  style={{ 
                    borderColor: inputColor || undefined, 
                    backgroundColor: inputBgColor ? inputBgColor : undefined,
                    color: inputTextColor || undefined,
                    '--placeholder-color': getColor(inputTextColor) || undefined,
                    '--focus-ring-color': getColor(accentColor, 0.6) || undefined
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingPlaceholder(true);
                  }}
                  readOnly
                />
            }
          </div>
        )

      case 'dropdown':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel
                ? <input
                    ref={labelInputRef}
                    type="text"
                    value={editLabelValue}
                    onChange={(e) => setEditLabelValue(e.target.value)}
                    onBlur={handleSaveLabel}
                    onKeyDown={handleLabelKeyDown}
                    className="block text-sm font-medium bg-transparent outline-none w-full p-0 border-0 leading-5"
                  />
                : <Label
                    className="cursor-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect();
                      setIsEditingLabel(true);
                    }}
                  >
                    {block.label}
                    {block.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
            )}

            {isEditingPlaceholder
              ? <div className="relative max-w-[300px]">
                  <Input
                    ref={placeholderInputRef}
                    type="text"
                    className="h-[42px] pr-10 pt-[7px]"
                    value={editPlaceholderValue}
                    onChange={(e) => setEditPlaceholderValue(e.target.value)}
                    onBlur={handleSavePlaceholder}
                    onKeyDown={handlePlaceholderKeyDown}
                    style={{ 
                      borderColor: inputColor || undefined, 
                      backgroundColor: inputBgColor || undefined,
                      color: inputTextColor || undefined,
                      '--placeholder-color': getColor(inputTextColor) || undefined,
                      '--focus-ring-color': getColor(accentColor, 0.6) || undefined
                    }}
                  />
                  <ChevronDown 
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none opacity-80" 
                    style={{ color: inputTextColor || 'currentColor' }}
                  />
                </div>
              : <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingPlaceholder(true);
                  }}
                  className="max-w-[300px] cursor-text"
                >
                  <Select
                    placeholder={block?.placeholder}
                    options={block?.options}
                    value=""
                    className="pointer-events-none"
                    style={{ 
                      borderColor: inputColor || undefined, 
                      backgroundColor: inputBgColor ? inputBgColor : undefined,
                      color: inputTextColor || undefined,
                      '--placeholder-color': getColor(inputTextColor) || undefined,
                      '--focus-ring-color': getColor(accentColor, 0.6) || undefined
                    }}
                    textColor={inputTextColor}
                  />
                </div>
            }
          </div>
        )


      case 'checkbox':
      case 'radio':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel
                ? <input
                    ref={labelInputRef}
                    type="text"
                    value={editLabelValue}
                    onChange={(e) => setEditLabelValue(e.target.value)}
                    onBlur={handleSaveLabel}
                    onKeyDown={handleLabelKeyDown}
                    className="block text-sm font-medium bg-transparent outline-none w-full p-0 border-0 leading-5"
                  />
                : <Label
                    className="cursor-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect();
                      setIsEditingLabel(true);
                    }}
                  >
                    {block.label}
                    {block.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
            )}

            <BlockChoiceCard
              block={block}
              onUpdateBlock={onUpdateBlock}
              isEditable
              inputColor={inputColor}
            />
          </div>
        )


      case 'line-items':
        const lineItems = block.lineItems || [];
        const layout = block.lineItemsLayout || 'grid-2';

        if (lineItems.length === 0) {
          return (
            <div className="space-y-2">
              {showLabel && (
                <Label className="cursor-text">
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              )}
              <div className="p-6 border-2 border-dashed border-border rounded-lg text-center">
                <p
                  className="text-sm text-muted-foreground"
                  style={{color: getColor(formTextColor, 0.7) }}
                >
                  Позиції не додано. Керуйте ними в параметрах блоку.
                </p>
              </div>
            </div>
          );
        }

        // Render actual Line items
        if (layout === 'list') {
          // Determine if form text color is light (white) or dark (black)
          // formTextColor could be 'text-[#ffffff]', 'text-white', 'text-foreground', etc.
          const isLightText = formTextColor?.includes('#fff') || 
                              formTextColor?.includes('white') || 
                              formTextColor?.includes('slate-100') ||
                              formTextColor?.includes('slate-50');
          
          // For dark text colors, use black with opacity; for light text colors, use white with opacity
          const infoBgColor = isLightText 
            ? 'white/[0.05]'
            : 'black/[0.03]'

          return (
            <div className="space-y-2">
              {showLabel && (
                <Label className="cursor-text">
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              )}
              <div className="space-y-2">
                {lineItems.map((lineItem) => (
                  <div
                    key={lineItem.id}
                    className="flex items-stretch gap-0 rounded-lg cursor-pointer transition-all overflow-hidden relative"
                  >
                    <div className="w-20 h-20 bg-muted flex-shrink-0 rounded-lg overflow-hidden relative">
                      {lineItem.images[0] ? (
                        <img
                          src={lineItem.images[0]}
                          alt={lineItem.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className={`flex-1 min-w-0 flex items-center px-3 py-2 ml-2 bg-${infoBgColor} rounded-[10px] transition-all duration-200`}>
                      <div>
                        <h4 className="font-semibold text-base truncate leading-[1.2]">
                          {lineItem.name}
                        </h4>
                        <p className="text-sm opacity-70">
                          ${lineItem.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Grid view
        const gridCols = layout === 'grid-2' ? 'grid-cols-2' : 'grid-cols-3';
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label className="cursor-text">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <div className={cn('grid gap-4', gridCols)}>
              {lineItems.map((lineItem) => (
                <div
                  key={lineItem.id}
                  className="rounded-lg overflow-hidden cursor-pointer transition-all relative"
                >
                  <div className="aspect-square bg-muted relative rounded-lg overflow-hidden">
                    {lineItem.images[0] ? (
                      <img
                        src={lineItem.images[0]}
                        alt={lineItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="mt-1 px-3 py-2 rounded-[10px] transition-all duration-200">
                    <h4 className="font-semibold text-base break-words leading-[1.2]">
                      {lineItem.name}
                    </h4>
                    <p className="text-sm mt-0.5 opacity-70">
                      ${lineItem.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )


      case 'messenger-select':
        return <BlockMessengerSelect
                 block={block}
                 style={{
                   borderColor: inputColor || undefined,
                   backgroundColor: inputBgColor ? inputBgColor : undefined,
                   color: inputTextColor || undefined,
                   '--focus-ring-color': getColor(accentColor, 0.6) || undefined
                 }}
               />
      default:
        return <div>Невідомий тип блоку</div>
    }
  }

  // messenger-select: show menu but only with move buttons (no delete/duplicate)
  const isMessengerSelect = block.type === 'messenger-select';

  return (
    <div
      data-block-root
      className={cn(
        'group relative py-1.5',
        'transition-all duration-300 ease-out',
        // border overlay that extends beyond block without affecting layout
        "after:content-[''] after:absolute after:-inset-x-2 after:-inset-y-0 after:rounded-lg after:pointer-events-none",
        'after:transition-all after:duration-300 after:ease-out',
        // Border logic: If active (selected in settings): primary border (thick), otherwise transparent border, show border on hover
        isActive
          ? 'after:border-2 after:border-primary'
          : 'after:border after:border-transparent hover:after:border-border'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Block content */}
      <div
        className="w-full"
        style={block.textColor ? { color: block.textColor } : undefined}
      >
        {renderBlockContent()}
      </div>

      {/* Bottom action menu - only shown when active */}
      {isActive && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-[42px] z-30">
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 backdrop-blur-xl border border-black/10 shadow-[2px_2px_0_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Delete and Duplicate buttons - NOT shown for messenger-select */}
            {!isMessengerSelect && (
              <>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleDeleteConfirm}
                      className="px-3 py-1.5 text-sm font-medium text-white/85 bg-red-500/95 hover:bg-red-600/85 rounded-xl transition-smooth"
                    >
                      Видалити
                    </button>
                    <button
                      onClick={handleDeleteCancel}
                      className="px-3 py-1.5 text-sm font-medium text-[#2F3032] hover:bg-black/[0.06] rounded-xl transition-smooth"
                    >
                      Скасувати
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleDeleteClick}
                      className="p-2 hover:bg-black/[0.06] text-red-600 rounded-xl transition-smooth"
                      title="Видалити"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Visual separator */}
                    <div className="w-px h-6 bg-black/10 mx-1" />

                    {/* Duplicate button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate();
                      }}
                      className="p-2 hover:bg-black/[0.06] text-[#2F3032] rounded-xl transition-smooth"
                      title="Дублювати"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Visual separator before move buttons */}
                    <div className="w-px h-6 bg-black/10 mx-1" />
                  </>
                )}
              </>
            )}

            {/* Move buttons - always shown (including for messenger-select) */}
            {!showDeleteConfirm && (
              <>
                {/* Move up button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp();
                  }}
                  disabled={blockIndex === 0}
                  className={cn(
                    "p-2 rounded-xl transition-smooth",
                    blockIndex === 0
                      ? "text-[#2F3032]/40 cursor-not-allowed"
                      : "hover:bg-black/[0.06] text-[#2F3032]"
                  )}
                  title="Вгору"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                {/* Move down button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown();
                  }}
                  disabled={blockIndex === totalBlocks - 1}
                  className={cn(
                    "p-2 rounded-xl transition-smooth",
                    blockIndex === totalBlocks - 1
                      ? "text-[#2F3032]/40 cursor-not-allowed"
                      : "hover:bg-black/[0.06] text-[#2F3032]"
                  )}
                  title="Вниз"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// components/form-builder/FormRenderer

'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowRight, Image } from 'lucide-react'
import { useState } from 'react'
import { cn, getImageUrl, getColor, dateChange } from '@/utils'
import { BlockLineItemsRenderer } from '@/components/form-builder/block/LineItemsRenderer'
import { OrderButton } from '@/components/ui/OrderButton'
import { BlockSlideshow } from '@/components/form-builder/block/Slideshow'
import { BlockReviews } from '@/components/form-builder/block/Reviews'
import { BlockFAQ } from '@/components/form-builder/block/FAQ'
import { BlockMap } from '@/components/form-builder/block/Map'
import { BlockIcon } from '@/components/form-builder/block/Icon'
import { BlockAvatar } from '@/components/form-builder/block/Avatar'
import { BlockMessengerSelect } from '@/components/form-builder/block/MessengerSelect'
import { BlockList } from '@/components/form-builder/block/List'
import { BlockChoiceCard } from '@/components/form-builder/block/ChoiceCard';
import { DatePicker } from '@/components/ui/DatePicker'

// Internal component for choice blocks with state
const BlockChoicePreview = ({ 
  block, 
  formDesign, 
  showLabel 
}) => {
  const [selectedValues, setSelectedValues] = useState([])
  const isCheckbox = block.type === 'checkbox'

  const handleSelect = (value) => {
    if (isCheckbox) {
      setSelectedValues(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    } else {
      setSelectedValues([value]);
    }
  }

  return (
    <div className="space-y-3">
      {showLabel && (
        <Label htmlFor={block.id}>
          {block.label}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <BlockChoiceCard
        block={block}
        isPreview
        inputColor={formDesign.inputColor}
        accentColor={formDesign.accentColor}
        selectedValues={selectedValues}
        onSelect={handleSelect}
      />
    </div>
  )
}

export const FormRenderer = ({
  blocks,
  successBlocks,
  submitButtonText,
  formDesign,
  formSlug = 'form',
  formName = '',
  isPreview = false,
  onSubmitSuccess,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLineItems, setSelectedLineItems] = useState([])
  const [dateValues, setDateValues] = useState({})

  const handleSelectLineItem = (lineItemId, quantity) => {
    setSelectedLineItems((prev) => {
      if (quantity === 0) {
        return prev.filter((p) => p.lineItemId !== lineItemId)
      }

      const existing = prev.find((p) => p.lineItemId === lineItemId)
      if (existing) {
        return prev.map((p) => (p.lineItemId === lineItemId ? { ...p, quantity } : p))
      }

      return [...prev, { lineItemId, quantity }]
    })
  }

  const handleSubmit = async (e) => {
    // Підтримка і <form onSubmit>, і button onClick (без event)
    if (e?.preventDefault) e.preventDefault()

    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      const formElement = e?.target?.tagName === 'FORM'
        ? e.target
        : document.querySelector(`form[data-form-slug="${formSlug}"]`)

      // Form configuration
      const formConfiguration = {
        formName,
        formSlug,
        formDesign,
        submitButtonText,
        blocks,
        successBlocks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Order data
      const orderData = {
        formSlug,
        submittedAt: new Date().toISOString(),
        fields: {},
        lineItems: [],
      }

      // Process each block to extract field values
      blocks.forEach((block) => {
        if ([
          'heading', 'paragraph', 'image',
          'spacer', 'divider', 'avatar',
          'slideshow', 'reviews', 'map',
          'faq', 'icon', 'list'
        ].includes(block.type)) {
          return
        }

        const fieldKey = block.id
        const fieldLabel = block.label || block.type

        if (block.type === 'line-items') {
          const lineItemDetails = selectedLineItems.map((sp) => {
            const lineItem = block.lineItems?.find((p) => p.id === sp.lineItemId)
            return lineItem
              ? {
                  lineItemId: lineItem.id,
                  lineItemName: lineItem.name,
                  sku: lineItem.sku,
                  quantity: sp.quantity,
                  price: lineItem.price,
                  subtotal: lineItem.price * sp.quantity,
                }
              : null
          }).filter(Boolean)
          
          orderData.lineItems = lineItemDetails
        } else if (block.type === 'checkbox') {
          const checkedValues = []
          block.options?.forEach((option, idx) => {
            const checkbox = formElement?.querySelector?.(`#${block.id}-${idx}`)
            if (checkbox?.checked) {
              checkedValues.push(option)
            }
          })
          orderData.fields[fieldKey] = {
            label: fieldLabel,
            type: block.type,
            value: checkedValues,
            required: block.required || false,
          }
        } else if (block.type === 'radio') {
          const checkedRadio = formElement?.querySelector?.(`input[name="${block.id}"]:checked`)
          orderData.fields[fieldKey] = {
            label: fieldLabel,
            type: block.type,
            value: checkedRadio?.value || null,
            required: block.required || false,
          }
        } else {
          // Handle other input types (short-text, long-text, email, number, date, dropdown)
          const input = formElement?.querySelector?.(`[name="${block.id}"]`)
          orderData.fields[fieldKey] = {
            label: fieldLabel,
            type: block.type,
            value: input?.value || null,
            required: block.required || false,
          }
        }
      })

      // Calculate totals for lineItems
      if (orderData.lineItems.length > 0) {
        orderData.lineItemsTotal = orderData.lineItems.reduce(
          (sum, p) => sum + (p?.subtotal || 0),
          0
        )
      }
    
      // if (isPreview) {
      //   console.log('Form Configuration:', formConfiguration)
      //   console.log('Order Data:', orderData)
      // }

      if (onSubmitSuccess) {
        await onSubmitSuccess({ formConfiguration, orderData })
      }

      setIsSubmitted(true)
    } catch (error) {
      alert('Не вдалося надіслати форму. Спробуйте ще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderImageGrid = (block) => {
    const count = block.imageCount || 1
    const images = block.images || []
    const positions = block.imagePositions || []
    const fit = block.imageFit || 'cover'
    const align = block.imageAlign || 'center'
    const radius = block.imageRadius || 'small'

    const gridClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-2',
      5: 'grid-cols-3',
    }[count]

    const alignClass = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    }[align]

    const radiusClass = {
      none: 'rounded-none',
      small: 'rounded-lg',
      medium: 'rounded-2xl',
      full: 'rounded-[2rem]',
    }[radius]

    return (
      <div className={cn('grid gap-3', gridClass)}>
        {Array.from({ length: count }).map((_, i) => {
          const hasImage = Boolean(images[i])
          const pos = positions[i] || { x: 50, y: 50 }

          return (
            <div
              key={i}
              className={cn(
                'aspect-video overflow-hidden',
                radiusClass,
                hasImage
                  ? ''
                  : 'border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2'
              )}
            >
              {hasImage ? (
                <div className={cn('w-full h-full flex', alignClass)}>
                  <img
                    src={getImageUrl(images[i])}
                    alt={`Form image ${i + 1}`}
                    className={cn(
                      fit === 'cover' ? 'w-full h-full object-cover' : 'h-full object-contain',
                      fit === 'contain' && radiusClass
                    )}
                    style={fit === 'cover' ? { objectPosition: `${pos.x}% ${pos.y}%` } : undefined}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              ) : (
                <>
                  <Image className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Image placeholder</span>
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderBlock = (block) => {
    const showLabel = block.showLabel !== false

    switch (block.type) {
      case 'divider':
        return (
          <div className="w-full flex justify-center py-2">
            <hr
              className="border-0"
              style={{
                width: `${block.dividerWidth || 100}%`,
                height: `${block.dividerThickness || 1}px`,
                backgroundColor:
                  block.dividerStyle === 'solid'
                    ? (block.dividerColor || '#e5e7eb')
                    : 'transparent',
                backgroundImage:
                  block.dividerStyle === 'dashed' 
                    ? `repeating-linear-gradient(to right, ${block.dividerColor || '#e5e7eb'} 0, ${
                        block.dividerColor || '#e5e7eb'
                      } 8px, transparent 8px, transparent 14px)`
                  : block.dividerStyle === 'dotted'
                    ? `repeating-linear-gradient(to right, ${block.dividerColor || '#e5e7eb'} 0, ${
                        block.dividerColor || '#e5e7eb'
                      } ${(block.dividerThickness || 1) * 2}px, transparent ${
                        (block.dividerThickness || 1) * 2
                      }px, transparent ${(block.dividerThickness || 1) * 4}px)`
                    : 'none',
                borderRadius: block.dividerStyle === 'dotted' ? `${(block.dividerThickness || 1) / 2}px` : '0',
              }}
            />
          </div>
        )

      case 'spacer':
        return <div style={{ height: `${block.height || 32}px` }} />

      case 'image':
        return renderImageGrid(block)

      case 'slideshow':
        return <BlockSlideshow block={block} isPreview={isPreview} />

      case 'reviews':
        return <BlockReviews block={block} isPreview={isPreview} />

      case 'faq':
        return <BlockFAQ block={block} isPreview={isPreview} />

      case 'map':
        return <BlockMap block={block} isPreview={isPreview} />

      case 'icon':
        return <BlockIcon block={block} />

      case 'list':
        return <BlockList block={block} isPreview={isPreview} />

      case 'avatar':
        return <BlockAvatar block={block} />

      case 'messenger-select':
        return <BlockMessengerSelect
                 block={block}
                 isPreview={isPreview}
                 style={{ 
                   borderColor: formDesign.inputColor || undefined,
                   backgroundColor: formDesign.inputBgColor ? formDesign.inputBgColor : undefined,
                   color: formDesign.inputTextColor || undefined,
                   '--focus-ring-color': getColor(formDesign.accentColor, 0.6) || undefined
                 }}
               />

      case 'line-items':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label htmlFor={block.id}>
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <BlockLineItemsRenderer
              block={block}
              selectedLineItems={selectedLineItems}
              onSelectLineItem={handleSelectLineItem}
              isPreview={isPreview}
              accentColor={formDesign.accentColor}
              formTextColor={formDesign.textColor}
            />
          </div>
        )

      case 'heading': {
        const headingAlign =
          block.textAlign === 'center' ? 'text-center' : block.textAlign === 'right' ? 'text-right' : 'text-left'
        return <h2
                 className={cn('font-semibold', headingAlign)}
                 style={{
                  color: formDesign.headingColor,
                  fontSize: formDesign.headingSize
                }}
               >
                {block.label}
              </h2>
      }

      case 'paragraph': {
        const paragraphAlign =
          block.textAlign === 'center'
            ? 'text-center'
            : block.textAlign === 'right'
              ? 'text-right'
              : 'text-left'
        return (
          <div style={block.textColor ? { color: block.textColor } : undefined}>
            <p className={cn('whitespace-pre-wrap break-words', paragraphAlign)}>{block.label}</p>
          </div>
        )
      }

      case 'short-text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label htmlFor={block.id}>
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Input
              id={block.id}
              name={block.id}
              className="max-w-[300px]"
              type={
                block.type === 'email'
                  ? 'email'
                  : block.type === 'number'
                    ? 'number'
                    : 'text'
              }
              placeholder={block.placeholder}
              required={block.required}
              style={{
                borderColor: formDesign.inputColor || undefined,
                backgroundColor: formDesign.inputBgColor ? formDesign.inputBgColor : undefined,
                color: formDesign.inputTextColor || undefined,
                '--placeholder-color': getColor(formDesign.inputTextColor) || undefined,
                '--focus-ring-color': getColor(formDesign.accentColor, 0.6) || undefined
              }}
            />
          </div>
        )

      case 'date':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label htmlFor={block.id}>
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <DatePicker
              className="max-w-[300px]"
              value={dateValues[block.id]}
              onChange={(date) => dateChange(block.id, date, setDateValues)}
              placeholder={block?.placeholder}
              inputColor={formDesign.inputColor}
              inputBgColor={formDesign.inputBgColor}
              inputTextColor={formDesign.inputTextColor}
              accentColor={formDesign.accentColor}
            />
          </div>
        )

      case 'long-text':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label htmlFor={block.id}>
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Textarea
              id={block.id}
              name={block.id}
              className="w-full"
              placeholder={block.placeholder}
              required={block.required}
              style={{ 
                borderColor: formDesign.inputColor || undefined,
                backgroundColor: formDesign.inputBgColor ? formDesign.inputBgColor : undefined,
                color: formDesign.inputTextColor || undefined,
                '--placeholder-color': getColor(formDesign.inputTextColor) || undefined,
                '--focus-ring-color': getColor(formDesign.accentColor, 0.6) || undefined
              }}
            />
          </div>
        )

      case 'dropdown':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label htmlFor={block.id}>
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Select
              id={block.id}
              name={block.id}
              placeholder={block?.placeholder || 'Оберіть варіант'}
              options={block?.options}
              className="max-w-[300px]"
              defaultValue=""
              required={block.required}
              style={{ 
                borderColor: formDesign.inputColor || undefined,
                backgroundColor: formDesign.inputBgColor ? formDesign.inputBgColor : undefined,
                color: formDesign.inputTextColor || undefined,
                '--focus-ring-color': getColor(formDesign.accentColor, 0.6) || undefined
              }}
              textColor={formDesign.inputTextColor}
            />
          </div>
        )

      case 'checkbox':
      case 'radio':
        return (
          <BlockChoicePreview
            block={block}
            formDesign={formDesign}
            showLabel={showLabel}
          />
        )

      default:
        return null
    }
  }

  // Calculate Line Item totals for sticky button
  const hasLineItemsBlock = blocks.some((b) => b.type === 'line-items')
  const totalQuantity = selectedLineItems.reduce((sum, sp) => sum + sp.quantity, 0)
  const totalAmount = selectedLineItems.reduce((sum, sp) => {
    const lineItemBlock = blocks.find((b) => b.type === 'line-items')
    const lineItem = lineItemBlock?.lineItems?.find((p) => p.id === sp.lineItemId)
    return sum + (lineItem?.price ?? 0) * sp.quantity
  }, 0)

  const showLineItemInfo = formDesign.stickyButton && hasLineItemsBlock && totalQuantity > 0
  const displayButtonText = formDesign.stickyButton && hasLineItemsBlock ? 'Замовити' : submitButtonText

  // ✅ В preview краще sticky, на slug — fixed
  const stickyWrapperClass = isPreview ? 'sticky bottom-0' : 'fixed bottom-0 left-0 right-0'

  return (
    <div className={cn('relative w-full', !isPreview ? 'min-h-screen' : 'min-h-full')}>
      {/* ✅ Background layer:
          - slug: fixed (covers overscroll)
          - preview: absolute (stays inside modal)
      */}
      <div
        className={isPreview ? 'absolute inset-0 -z-10' : 'fixed inset-0 -z-10'}
        style={{ backgroundColor: formDesign.backgroundColor }}
      />

      <div className="w-full pt-6 pb-10 px-4 sm:px-6">
        <div
          className="w-full max-w-[700px] mx-auto"
          style={{
            color: formDesign.textColor,
            fontSize: formDesign.fontSize
          }}
        >
          {blocks.length === 0 && !isSubmitted ? (
            <div className="flex items-center justify-center h-64">
              <p>Немає блоків для відображення.</p>
            </div>
          ) : isSubmitted ? (
            <div className="py-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                {/* Render success blocks */}
                <div className="space-y-2">
                  {successBlocks.map((block) => (
                    <div key={block.id}>{renderBlock(block)}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form
              data-form-slug={formSlug}
              onSubmit={handleSubmit}
              className={cn('flex flex-wrap gap-4 items-start', formDesign.stickyButton && 'pb-24')}
            >
              {blocks.map((block) => {
                const widthClass = {
                  '1/1': 'w-full',
                  '1/2': 'w-[calc(50%-0.5rem)]',
                  '1/3': 'w-[calc(33.333%-0.67rem)]',
                }[block.blockWidth || '1/1']

                const verticalAlignClass = {
                  top: 'self-start',
                  center: 'self-center',
                  bottom: 'self-end',
                }[block.blockVerticalAlign || 'top']

                const horizontalAlignClass =
                  block.blockWidth !== '1/1'
                  ? {
                      start: '',
                      center: 'mx-auto',
                      end: 'ml-auto',
                    }[block.blockHorizontalAlign || 'start']
                  : ''

                return (
                  <div
                    key={block.id}
                    className={cn(widthClass, verticalAlignClass, horizontalAlignClass, 'py-2')}
                  >
                    {renderBlock(block)}
                  </div>
                )
              })}

              {!formDesign.stickyButton && (
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="black"
                    size="black"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Надсилаю...' : submitButtonText}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Sticky Submit Button */}
      {formDesign.stickyButton && !isSubmitted && blocks.length > 0 && (
        <div className={cn(stickyWrapperClass, 'p-4')}>
          <div className="w-full max-w-[700px] mx-auto">
            {/* <Button
              type="button"
              variant="order"
              size="order"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {showLineItemInfo ? (
                <>
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted-foreground/30 text-sm">
                    {totalQuantity}
                  </span>
                  <span className="flex-1 text-center">{displayButtonText}</span>
                  <span className="text-sm font-medium">${totalAmount.toFixed(2)}</span>
                </>
              ) : (
                <>
                  <span className="w-7" />
                  <span className="flex-1 text-center">{displayButtonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button> */}


            <OrderButton
              hasLineItems={showLineItemInfo}
              quantityLineItems={totalQuantity}
              totalAmount={totalAmount.toFixed(2)}
              submitButtonText={displayButtonText}
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  )
}

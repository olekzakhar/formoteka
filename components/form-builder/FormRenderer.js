// components/form-builder/FormRenderer

'use client'

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Image } from 'lucide-react';
import { useState } from 'react';
import { cn, getImageUrl } from '@/utils';
import { BlockProductsRenderer } from '@/components/form-builder/block/ProductsRenderer';
import { BlockSlideshow } from '@/components/form-builder/block/Slideshow';
import { BlockReviews } from '@/components/form-builder/block/Reviews';
import { BlockFAQ } from '@/components/form-builder/block/FAQ';
import { BlockMap } from '@/components/form-builder/block/Map';
import { BlockIcon } from '@/components/form-builder/block/Icon';
import { BlockAvatar } from '@/components/form-builder/block/Avatar';
import { BlockMessengerSelect } from '@/components/form-builder/block/MessengerSelect';
import { BlockList } from '@/components/form-builder/block/List';

const fontSizeClass = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

const headingSizeClass = {
  small: 'text-lg',
  medium: 'text-xl',
  large: 'text-2xl',
  xlarge: 'text-3xl',
};

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const textColorHex = formDesign.textColor?.match(/text-\[(#[0-9A-Fa-f]{6})\]/)?.[1];
  const bgColorHex = formDesign.backgroundColor?.match(/bg-\[(#[0-9A-Fa-f]{6})\]/)?.[1];

  const handleSelectProduct = (productId, quantity) => {
    setSelectedProducts((prev) => {
      if (quantity === 0) {
        return prev.filter((p) => p.productId !== productId);
      }
      const existing = prev.find((p) => p.productId === productId);
      if (existing) {
        return prev.map((p) => (p.productId === productId ? { ...p, quantity } : p));
      }
      return [...prev, { productId, quantity }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formElement = e.target;
      
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
      };

      // Submission data
      const submissionData = {
        formSlug,
        submittedAt: new Date().toISOString(),
        fields: {},
        products: []
      };

      // Process each block to extract field values
      blocks.forEach((block) => {
        if ([
          'heading', 'paragraph', 'image',
          'spacer', 'divider', 'avatar',
          'slideshow', 'reviews', 'map',
          'faq', 'icon', 'list'
        ].includes(block.type)) {
          return;
        }

        const fieldKey = block.id;
        const fieldLabel = block.label || block.type;

        if (block.type === 'products') {
          const productDetails = selectedProducts.map((sp) => {
            const product = block.products?.find((p) => p.id === sp.productId);
            return product ? {
              productId: product.id,
              productName: product.name,
              sku: product.sku,
              quantity: sp.quantity,
              price: product.price,
              subtotal: product.price * sp.quantity,
            } : null;
          }).filter(Boolean);
          
          submissionData.products = productDetails;
        } else if (block.type === 'checkbox') {
          const checkedValues = [];
          block.options?.forEach((option, idx) => {
            const checkbox = formElement.querySelector(`#${block.id}-${idx}`);
            if (checkbox?.checked) {
              checkedValues.push(option);
            }
          });
          submissionData.fields[fieldKey] = {
            label: fieldLabel,
            type: block.type,
            value: checkedValues,
            required: block.required || false,
          };
        } else if (block.type === 'radio') {
          const checkedRadio = formElement.querySelector(`input[name="${block.id}"]:checked`);
          submissionData.fields[fieldKey] = {
            label: fieldLabel,
            type: block.type,
            value: checkedRadio?.value || null,
            required: block.required || false,
          };
        } else {
          const input = formElement.querySelector(`[name="${block.id}"]`);
          submissionData.fields[fieldKey] = {
            label: fieldLabel,
            type: block.type,
            value: input?.value || null,
            required: block.required || false,
          };
        }
      });

      if (submissionData.products.length > 0) {
        submissionData.productsTotal = submissionData.products.reduce(
          (sum, p) => sum + (p?.subtotal || 0),
          0
        );
      }

      if (isPreview) {
        console.log('Form Configuration:', formConfiguration);
        console.log('Submission Data:', submissionData);
      }

      if (onSubmitSuccess) {
        await onSubmitSuccess({ formConfiguration, submissionData });
      }
      
      setIsSubmitted(true);
    } catch (error) {
      alert('Не вдалося надіслати форму. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImageGrid = (block) => {
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
          const pos = positions[i] || { x: 50, y: 50 };

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
          );
        })}
      </div>
    );
  };

  const renderBlock = (block) => {
    const showLabel = block.showLabel !== false;

    switch (block.type) {
      case 'divider':
        return (
          <div className="w-full flex justify-center py-2">
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
        );

      case 'spacer':
        return <div style={{ height: `${block.height || 32}px` }} />;

      case 'image':
        return renderImageGrid(block);

      case 'slideshow':
        return <BlockSlideshow block={block} isPreview={isPreview} />;

      case 'reviews':
        return <BlockReviews block={block} isPreview={isPreview} />;

      case 'faq':
        return <BlockFAQ block={block} isPreview={isPreview} />;

      case 'map':
        return <BlockMap block={block} isPreview={isPreview} />;

      case 'icon':
        return <BlockIcon block={block} />;

      case 'list':
        return <BlockList block={block} isPreview={isPreview} />;

      case 'avatar':
        return <BlockAvatar block={block} />;

      case 'messenger-select':
        return <BlockMessengerSelect block={block} isPreview={isPreview} />;

      case 'products':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label className="text-foreground">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <BlockProductsRenderer
              block={block}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              isPreview={isPreview}
            />
          </div>
        );

      case 'heading':
        const headingAlign = block.textAlign === 'center' ? 'text-center' : block.textAlign === 'right' ? 'text-right' : 'text-left';
        const hColor = formDesign.headingColor || 'text-foreground';
        const hSize = headingSizeClass[formDesign.headingSize || 'medium'];
        return <h2 className={cn("font-semibold", hSize, hColor, headingAlign)}>{block.label}</h2>;

      case 'paragraph':
        const paragraphAlign =
          block.textAlign === 'center' ? 'text-center' : block.textAlign === 'right' ? 'text-right' : 'text-left';
        return (
          <div style={block.textColor ? { color: block.textColor } : undefined}>
            <p className={cn('whitespace-pre-wrap break-words', 'opacity-80', paragraphAlign)}>{block.label}</p>
          </div>
        );

      case 'short-text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label className="text-foreground">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Input
              name={block.id}
              className="max-w-[300px]"
              type={block.type === 'email' ? 'email' : block.type === 'number' ? 'number' : 'text'}
              placeholder={block.placeholder}
              required={block.required}
            />
          </div>
        );

      case 'long-text':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label className="text-foreground">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Textarea name={block.id} className="w-full" placeholder={block.placeholder} required={block.required} />
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label className="text-foreground">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Input name={block.id} className="max-w-[300px]" type="date" required={block.required} />
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label className="text-foreground">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <select
              name={block.id}
              className="flex h-10 w-full max-w-[300px] rounded-md border border-input bg-input px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              defaultValue=""
              required={block.required}
            >
              <option value="" disabled>{block.placeholder || 'Select an option'}</option>
              {block.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {showLabel && (
              <Label className="text-foreground">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <div className="space-y-2">
              {block.options?.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox id={`${block.id}-${idx}`} />
                  <Label htmlFor={`${block.id}-${idx}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {showLabel && (
              <Label className="text-foreground">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <div className="space-y-2">
              {block.options?.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={block.id}
                    value={option}
                    id={`${block.id}-${idx}`}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                    required={block.required && idx === 0}
                  />
                  <Label htmlFor={`${block.id}-${idx}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Calculate product totals
  const hasProductsBlock = blocks.some((b) => b.type === 'products');
  const totalQuantity = selectedProducts.reduce((sum, sp) => sum + sp.quantity, 0);
  const totalAmount = selectedProducts.reduce((sum, sp) => {
    const productBlock = blocks.find((b) => b.type === 'products');
    const product = productBlock?.products?.find((p) => p.id === sp.productId);
    return sum + (product?.price ?? 0) * sp.quantity;
  }, 0);

  const showProductInfo = formDesign.stickyButton && hasProductsBlock && totalQuantity > 0;
  const displayButtonText = formDesign.stickyButton && hasProductsBlock ? 'Order' : submitButtonText;

  return (
    <div
      className={cn('min-h-screen', !bgColorHex && formDesign.backgroundColor)}
      style={bgColorHex ? { backgroundColor: bgColorHex } : undefined}
    >
      <div className="w-full pt-6 pb-10 px-4 sm:px-6">
        <div
          className={cn(
            'w-full max-w-[700px] mx-auto',
            !textColorHex && formDesign.textColor,
            fontSizeClass[formDesign.fontSize]
          )}
          style={textColorHex ? { color: textColorHex } : undefined}
        >
          {blocks.length === 0 && !isSubmitted ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Немає блоків для відображення.</p>
            </div>
          ) : isSubmitted ? (
            <div className="py-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  {successBlocks.map((block) => (
                    <div key={block.id}>{renderBlock(block)}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={cn("flex flex-wrap gap-4 items-start", formDesign.stickyButton && "pb-24")}>
              {blocks.map((block) => {
                const widthClass = {
                  '1/1': 'w-full',
                  '1/2': 'w-[calc(50%-0.5rem)]',
                  '1/3': 'w-[calc(33.333%-0.67rem)]',
                }[block.blockWidth || '1/1'];

                const verticalAlignClass = {
                  top: 'self-start',
                  center: 'self-center',
                  bottom: 'self-end',
                }[block.blockVerticalAlign || 'top'];

                const horizontalAlignClass = block.blockWidth !== '1/1'
                  ? {
                      start: '',
                      center: 'mx-auto',
                      end: 'ml-auto',
                    }[block.blockHorizontalAlign || 'start']
                  : '';

                return (
                  <div
                    key={block.id}
                    className={cn(widthClass, verticalAlignClass, horizontalAlignClass, 'py-2')}
                  >
                    {renderBlock(block)}
                  </div>
                );
              })}
              {!formDesign.stickyButton && (
                <div className="pt-4">
                  <Button
                    variant="black"
                    size="black"
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-[700px] mx-auto">
            <Button
              type="button"
              onClick={handleSubmit}
              className={cn(
                'w-full flex items-center justify-between gap-2 px-4 py-4 rounded-xl font-medium',
                'bg-foreground text-background hover:bg-foreground/90',
                'focus:outline-none'
              )}
            >
              {showProductInfo ? (
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
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Image, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProductsBlockRenderer } from './ProductsBlockRenderer';
import { BASE_URL } from '@/constants';

const fontSizeClass = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

export const FormPreview = ({
  blocks,
  successBlocks,
  submitButtonText,
  formDesign,
  formName = 'my-form',
  onClose,
}) => {
  // Generate a fake form URL for preview
  const formSlug = formName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const formUrl = `${BASE_URL}/${formSlug}`;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Collect form data from the form element
    const formElement = e.target;
    
    // ========== FORM CONFIGURATION (the form structure itself) ==========
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

    // ========== FORM SUBMISSION DATA (user's input) ==========
    const submissionData = {
      formSlug,
      submittedAt: new Date().toISOString(),
      fields: {},
      products: []
    };

    // Process each block to extract field values
    blocks.forEach((block) => {
      if (['heading', 'paragraph', 'image', 'spacer'].includes(block.type)) {
        return; // Skip non-input blocks
      }

      const fieldKey = block.id;
      const fieldLabel = block.label || block.type;

      if (block.type === 'products') {
        // Handle products block
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
        // Handle checkbox (multiple values)
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
        // Handle radio (single value from group)
        const checkedRadio = formElement.querySelector(`input[name="${block.id}"]:checked`);
        submissionData.fields[fieldKey] = {
          label: fieldLabel,
          type: block.type,
          value: checkedRadio?.value || null,
          required: block.required || false,
        };
      } else {
        // Handle other input types (short-text, long-text, email, number, date, dropdown)
        const input = formElement.querySelector(`[name="${block.id}"]`);
        submissionData.fields[fieldKey] = {
          label: fieldLabel,
          type: block.type,
          value: input?.value || null,
          required: block.required || false,
        };
      }
    });

    // Calculate totals for products
    if (submissionData.products.length > 0) {
      submissionData.productsTotal = submissionData.products.reduce(
        (sum, p) => sum + (p?.subtotal || 0),
        0
      );
    }

    // Log all data to console
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           DATABASE SAVE DATA - FORM CONFIGURATION              ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log('║ This is the form structure that should be saved to the         ║');
    console.log('║ "forms" table in the database:                                 ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log(JSON.stringify(formConfiguration, null, 2));
    
    console.log('\n');
    
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           DATABASE SAVE DATA - FORM SUBMISSION                 ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log('║ This is the user submission that should be saved to the        ║');
    console.log('║ "form_submissions" table in the database:                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log(JSON.stringify(submissionData, null, 2));
    
    setIsSubmitted(true);
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
                    src={images[i]}
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

      case 'products':
        return (
          <div className="space-y-2">
            {showLabel && (
              <Label className="text-foreground">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <ProductsBlockRenderer
              block={block}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              isPreview
            />
          </div>
        );

      case 'heading':
        const headingAlign = block.textAlign === 'center' ? 'text-center' : block.textAlign === 'right' ? 'text-right' : 'text-left';
        return <h2 className={cn("text-xl font-semibold", headingAlign)}>{block.label}</h2>;

      case 'paragraph':
        const paragraphAlign =
          block.textAlign === 'center' ? 'text-center' : block.textAlign === 'right' ? 'text-right' : 'text-left';
        return <p className={cn('text-muted-foreground whitespace-pre-wrap break-words', paragraphAlign)}>{block.label}</p>;

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

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50" />

      {/* Content - centered with margins subtracted from viewport height */}
      <div className="relative h-full w-full flex items-center justify-center p-8">
        <div 
          className="w-[70vw] max-w-[960px] min-w-[320px] flex flex-col"
          style={{ height: 'calc(100vh - 64px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal container with header inside */}
          <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl h-full">
            {/* Top bar with form URL and close button - inside the modal */}
            <div className="bg-[#F3F4F6] px-4 py-2.5 flex items-center justify-between border-b">
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                aria-label="Close preview"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <a
                href={`https://${formUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {formUrl}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Form content */}
            <div
              className={cn(
                'flex-1 overflow-auto',
                formDesign.backgroundColor
              )}
            >
              <div className="w-full pt-6 pb-10 px-4 sm:px-6">
                <div className={cn('w-full max-w-[700px] mx-auto', formDesign.textColor, fontSizeClass[formDesign.fontSize])}>
                {blocks.length === 0 && !isSubmitted ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No blocks to preview. Add some blocks first.</p>
                  </div>
                ) : isSubmitted ? (
                  <div className="py-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                      {/* Render success blocks */}
                      <div className="space-y-2">
                        {successBlocks.map((block) => (
                          <div key={block.id}>{renderBlock(block)}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-0">
                    {blocks.map((block) => (
                      <div key={block.id} className="py-2">{renderBlock(block)}</div>
                    ))}
                    <div className="pt-4">
                      <Button
                        variant="black"
                        size="black"
                        type="submit"
                      >
                        {submitButtonText}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

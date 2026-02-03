import { useState } from 'react';
import { cn } from '@/utils';
import { Minus, Plus, Image as ImageIcon } from 'lucide-react';
import { ImageLightbox } from '@/components/form-builder/ImageLightbox';

export const BlockLineItemsRenderer = ({
  block,
  selectedLineItems,
  onSelectLineItem,
  isPreview = false,
}) => {
  const lineItems = block.lineItems || [];
  const layout = block.lineItemsLayout || 'grid-2';
  const [lightboxImages, setLightboxImages] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getSelectedQuantity = (lineItemId) => {
    const selected = selectedLineItems.find((s) => s.lineItemId === lineItemId);
    return selected?.quantity || 0;
  };

  const handleLineItemClick = (lineItem) => {
    const currentQuantity = getSelectedQuantity(lineItem.id);
    if (currentQuantity === 0) {
      // Select with minimum quantity
      onSelectLineItem(lineItem.id, lineItem.minQuantity);
    } else {
      // Deselect when clicking again
      onSelectLineItem(lineItem.id, 0);
    }
  };

  const handleIncrement = (e, lineItem) => {
    e.stopPropagation();
    const currentQuantity = getSelectedQuantity(lineItem.id);
    const maxQty = lineItem.maxQuantity ?? Infinity;
    if (currentQuantity < maxQty && currentQuantity < lineItem.stock) {
      onSelectLineItem(lineItem.id, currentQuantity + 1);
    }
  };

  const handleDecrement = (e, lineItem) => {
    e.stopPropagation();
    const currentQuantity = getSelectedQuantity(lineItem.id);
    if (currentQuantity > lineItem.minQuantity) {
      onSelectLineItem(lineItem.id, currentQuantity - 1);
    } else if (currentQuantity === lineItem.minQuantity) {
      // Deselect
      onSelectLineItem(lineItem.id, 0);
    }
  };

  const handleImageClick = (e, lineItem, imageIndex) => {
    e.stopPropagation();
    if (lineItem.images.length > 0) {
      setLightboxImages(lineItem.images);
      setLightboxIndex(imageIndex);
    }
  };

  if (lineItems.length === 0) {
    return (
      <div className="p-6 border-2 border-dashed border-border rounded-lg text-center">
        <p className="text-muted-foreground">No line items added yet</p>
      </div>
    );
  }

  // List view
  if (layout === 'list') {
    return (
      <>
        <div className="space-y-2">
          {lineItems.map((lineItem) => {
            const quantity = getSelectedQuantity(lineItem.id);
            const isSelected = quantity > 0;

            return (
              <div
                key={lineItem.id}
                onClick={() => handleLineItemClick(lineItem)}
                className={cn(
                  'flex items-stretch gap-0 rounded-lg border cursor-pointer transition-all overflow-hidden',
                  isSelected
                    ? 'border-primary/30 bg-primary/10'
                    : 'border-border hover:bg-muted/50'
                )}
              >
                {/* Image - full height, no margin */}
                <div
                  className="w-20 h-20 bg-muted flex-shrink-0 cursor-zoom-in"
                  onClick={(e) => handleImageClick(e, lineItem)}
                >
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

                {/* Info */}
                <div className="flex-1 min-w-0 flex items-start px-4 pt-3">
                  <div>
                    <h4 className="font-medium text-foreground truncate">{lineItem.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${lineItem.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantity controls */}
                {isSelected && (
                  <div className="flex items-center gap-1 px-2">
                    <button
                      type="button"
                      onClick={(e) => handleDecrement(e, lineItem)}
                      className="w-6 h-6 rounded-full bg-foreground/20 hover:bg-foreground/30 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-foreground" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={(e) => handleIncrement(e, lineItem)}
                      className="w-6 h-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        {lightboxImages && (
          <ImageLightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxImages(null)}
          />
        )}
      </>
    );
  }

  // Grid view (2 or 3 columns)
  const gridCols = layout === 'grid-2' ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <>
      <div className={cn('grid gap-4', gridCols)}>
        {lineItems.map((lineItem) => {
          const quantity = getSelectedQuantity(lineItem.id);
          const isSelected = quantity > 0;

          return (
            <div
              key={lineItem.id}
              onClick={() => handleLineItemClick(lineItem)}
              className={cn(
                'rounded-lg border overflow-hidden cursor-pointer transition-all',
                isSelected
                  ? 'border-primary/30 bg-primary/10'
                  : 'border-border hover:bg-muted/50'
              )}
            >
              {/* Image */}
              <div
                className="aspect-square bg-muted relative cursor-zoom-in"
                onClick={(e) => handleImageClick(e, lineItem)}
              >
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

              {/* Info */}
              <div className="p-3">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium text-foreground text-sm break-words flex-1">{lineItem.name}</h4>
                  <p className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">${lineItem.price.toFixed(2)}</p>
                </div>

                {/* Quantity controls */}
                {isSelected && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <button
                      type="button"
                      onClick={(e) => handleDecrement(e, lineItem)}
                      className="w-6 h-6 rounded-full bg-foreground/20 hover:bg-foreground/30 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-foreground" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={(e) => handleIncrement(e, lineItem)}
                      className="w-6 h-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxImages && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxImages(null)}
        />
      )}
    </>
  );
};

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus, Image as ImageIcon } from 'lucide-react';
import { ImageLightbox } from './ImageLightbox';

export const ProductsBlockRenderer = ({
  block,
  selectedProducts,
  onSelectProduct,
  isPreview = false,
}) => {
  const products = block.products || [];
  const layout = block.productsLayout || 'grid-2';
  const [lightboxImages, setLightboxImages] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getSelectedQuantity = (productId) => {
    const selected = selectedProducts.find((s) => s.productId === productId);
    return selected?.quantity || 0;
  };

  const handleProductClick = (product) => {
    const currentQuantity = getSelectedQuantity(product.id);
    if (currentQuantity === 0) {
      // Select with minimum quantity
      onSelectProduct(product.id, product.minQuantity);
    } else {
      // Deselect when clicking again
      onSelectProduct(product.id, 0);
    }
  };

  const handleIncrement = (e, product) => {
    e.stopPropagation();
    const currentQuantity = getSelectedQuantity(product.id);
    const maxQty = product.maxQuantity ?? Infinity;
    if (currentQuantity < maxQty && currentQuantity < product.stock) {
      onSelectProduct(product.id, currentQuantity + 1);
    }
  };

  const handleDecrement = (e, product) => {
    e.stopPropagation();
    const currentQuantity = getSelectedQuantity(product.id);
    if (currentQuantity > product.minQuantity) {
      onSelectProduct(product.id, currentQuantity - 1);
    } else if (currentQuantity === product.minQuantity) {
      // Deselect
      onSelectProduct(product.id, 0);
    }
  };

  const handleImageClick = (e, product, imageIndex) => {
    e.stopPropagation();
    if (product.images.length > 0) {
      setLightboxImages(product.images);
      setLightboxIndex(imageIndex);
    }
  };

  if (products.length === 0) {
    return (
      <div className="p-6 border-2 border-dashed border-border rounded-lg text-center">
        <p className="text-muted-foreground">No products added yet</p>
      </div>
    );
  }

  // List view
  if (layout === 'list') {
    return (
      <>
        <div className="space-y-2">
          {products.map((product) => {
            const quantity = getSelectedQuantity(product.id);
            const isSelected = quantity > 0;

            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
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
                  onClick={(e) => handleImageClick(e, product)}
                >
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
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
                    <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantity controls */}
                {isSelected && (
                  <div className="flex items-center gap-1 px-2">
                    <button
                      type="button"
                      onClick={(e) => handleDecrement(e, product)}
                      className="w-6 h-6 rounded-full bg-foreground/20 hover:bg-foreground/30 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-foreground" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={(e) => handleIncrement(e, product)}
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
        {products.map((product) => {
          const quantity = getSelectedQuantity(product.id);
          const isSelected = quantity > 0;

          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
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
                onClick={(e) => handleImageClick(e, product)}
              >
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
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
                  <h4 className="font-medium text-foreground text-sm break-words flex-1">{product.name}</h4>
                  <p className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">${product.price.toFixed(2)}</p>
                </div>

                {/* Quantity controls */}
                {isSelected && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <button
                      type="button"
                      onClick={(e) => handleDecrement(e, product)}
                      className="w-6 h-6 rounded-full bg-foreground/20 hover:bg-foreground/30 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-foreground" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={(e) => handleIncrement(e, product)}
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

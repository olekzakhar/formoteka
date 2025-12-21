import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { X, Plus, Copy, Trash2, ChevronUp, ChevronDown, Upload, Image as ImageIcon, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

const generateId = () => `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createEmptyProduct = () => ({
  id: generateId(),
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  minQuantity: 1,
  maxQuantity: null,
  images: [],
});

export const ManageProductsPopup = ({
  products,
  onUpdateProducts,
  onClose,
}) => {
  const isMobile = useIsMobile();
  const [selectedProductId, setSelectedProductId] = useState(
    products.length > 0 ? products[0].id : null
  );
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [localProducts, setLocalProducts] = useState(products);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newProduct, setNewProduct] = useState(createEmptyProduct());

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const selectedProduct = isCreatingNew
    ? newProduct
    : localProducts.find((p) => p.id === selectedProductId) || null;

  const handleAddProduct = () => {
    setIsCreatingNew(true);
    setExpandedProductId(null);
    setNewProduct(createEmptyProduct());
    setSelectedProductId(null);
  };

  const handleSelectProduct = (id) => {
    if (isMobile) {
      setIsCreatingNew(false);

      // Tap active product again -> deactivate + hide form
      if (expandedProductId === id) {
        setExpandedProductId(null);
        setSelectedProductId(null);
        return;
      }

      setExpandedProductId(id);
      setSelectedProductId(id);
      return;
    }

    setSelectedProductId(id);
    setIsCreatingNew(false);
  };

  const handleUpdateProduct = (updates) => {
    if (isCreatingNew) {
      setNewProduct((prev) => ({ ...prev, ...updates }));
    } else if (selectedProductId) {
      setLocalProducts((prev) =>
        prev.map((p) => (p.id === selectedProductId ? { ...p, ...updates } : p))
      );
    }
  };

  const handleSaveNewProduct = () => {
    if (newProduct.name.trim()) {
      const productToAdd = { ...newProduct, id: generateId() };
      // Add new product to the top of the list
      setLocalProducts((prev) => [productToAdd, ...prev]);
      // Reset to add new product mode
      setNewProduct(createEmptyProduct());
      setSelectedProductId(null);
      setIsCreatingNew(true);
    }
  };

  const handleDuplicateProduct = (id) => {
    const product = localProducts.find((p) => p.id === id);
    if (product) {
      const duplicated = {
        ...product,
        id: generateId(),
        name: `${product.name} (copy)`,
        sku: `${product.sku}-copy`,
      };
      const index = localProducts.findIndex((p) => p.id === id);
      const newProducts = [...localProducts];
      newProducts.splice(index + 1, 0, duplicated);
      setLocalProducts(newProducts);
      setSelectedProductId(duplicated.id);
    }
  };

  const handleDeleteProduct = (id) => {
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProductId === id) {
      setSelectedProductId(localProducts[0]?.id || null);
    }
  };

  const handleMoveProduct = (id, direction) => {
    const index = localProducts.findIndex((p) => p.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localProducts.length) return;

    const newProducts = [...localProducts];
    [newProducts[index], newProducts[newIndex]] = [newProducts[newIndex], newProducts[index]];
    setLocalProducts(newProducts);
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target).files;
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const url = ev.target?.result;
            if (isCreatingNew) {
              setNewProduct((prev) => ({
                ...prev,
                images: [...prev.images, url],
              }));
            } else if (selectedProductId) {
              setLocalProducts((prev) =>
                prev.map((p) =>
                  p.id === selectedProductId
                    ? { ...p, images: [...p.images, url] }
                    : p
                )
              );
            }
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  const handleRemoveImage = (imageIndex) => {
    if (isCreatingNew) {
      setNewProduct((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== imageIndex),
      }));
    } else if (selectedProductId) {
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProductId
            ? { ...p, images: p.images.filter((_, i) => i !== imageIndex) }
            : p
        )
      );
    }
  };

  const handleClose = () => {
    onUpdateProducts(localProducts);
    onClose();
  };

  const selectedIndex = localProducts.findIndex((p) => p.id === selectedProductId);

  const ProductForm = ({ variant }) => {
    if (!selectedProduct) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Select a product or add a new one
        </div>
      );
    }

    return (
      <div className={cn('space-y-6', variant === 'inline' && 'px-4 pb-4 pt-3 border-t border-border bg-muted/10')}>
        <h3 className="text-lg font-medium text-foreground">
          {isCreatingNew ? 'New Product' : 'Product'}
        </h3>

        {/* Name - Full width */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Name<span className="text-destructive">*</span>
          </Label>
          <Input
            value={selectedProduct.name}
            onChange={(e) => handleUpdateProduct({ name: e.target.value })}
            placeholder="My product"
            className="bg-muted/50"
          />
        </div>

        {/* SKU - Full width on new line */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            SKU<span className="text-destructive">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stock Keeping Unit - unique identifier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            value={selectedProduct.sku}
            onChange={(e) => handleUpdateProduct({ sku: e.target.value })}
            placeholder="frut1"
            className="bg-muted/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

          {/* Price */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Price<span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={selectedProduct.price}
              onChange={(e) =>
                handleUpdateProduct({ price: parseFloat(e.target.value) || 0 })
              }
              onFocus={(e) => e.target.select()}
              placeholder="10,00"
              className="bg-muted/50"
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Stock
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Available quantity in stock</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              type="number"
              value={selectedProduct.stock}
              onChange={(e) =>
                handleUpdateProduct({ stock: parseInt(e.target.value) || 0 })
              }
              onFocus={(e) => e.target.select()}
              placeholder="5"
              className="bg-muted/50"
            />
          </div>

          {/* Min Quantity */}
          <div className="space-y-2">
            <Label>Minimum Quantity / Submission</Label>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3" />
              If this product is selected, the submitter must order at least the minimum quantity or more.
            </p>
            <Input
              type="number"
              value={selectedProduct.minQuantity}
              onChange={(e) =>
                handleUpdateProduct({ minQuantity: parseInt(e.target.value) || 1 })
              }
              min={1}
              placeholder="1"
              className="bg-muted/50"
            />
          </div>

          {/* Max Quantity */}
          <div className="space-y-2">
            <Label>Maximum Quantity / Submission</Label>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3" />
              If this product is selected, the submitter can only order the maximum quantity or less.
            </p>
            <Input
              type="number"
              value={selectedProduct.maxQuantity ?? ''}
              onChange={(e) =>
                handleUpdateProduct({
                  maxQuantity: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="-"
              className="bg-muted/50"
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-3">
          <Label>Images</Label>
          <div className="flex flex-wrap gap-2">
            {selectedProduct.images.map((img, i) => (
              <div key={i} className="relative group">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => handleRemoveImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleAddImage} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Images
          </Button>
        </div>

        {/* Save button for new product */}
        {isCreatingNew && (
          <Button onClick={handleSaveNewProduct} disabled={!newProduct.name.trim()}>
            Save Product
          </Button>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        isMobile ? 'p-3' : 'p-8'
      )}
      onClick={handleClose}
    >
      <div className="fixed inset-0 bg-foreground/50" />

      <div
        className={cn(
          'relative bg-background rounded-2xl shadow-2xl flex flex-col',
          isMobile ? 'w-full' : 'w-[90vw] max-w-[1100px]'
        )}
        style={{ height: isMobile ? 'calc(100vh - 24px)' : 'calc(100vh - 64px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Керування продуктами</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className={cn('flex-1 flex overflow-hidden', isMobile && 'flex-col')}>
          {/* Product list */}
          <div
            className={cn(
              'flex flex-col',
              isMobile ? 'w-full' : 'w-[380px] border-r border-border'
            )}
            onClick={() => {
              setSelectedProductId(null);
              setExpandedProductId(null);
              setIsCreatingNew(false);
            }}
          >
            {/* Actions row (above products) */}
            <div
              className="px-4 py-3 border-b border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddProduct();
                    setExpandedProductId(null);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors',
                    isCreatingNew
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import / Export
                  </Button>
                  {/* <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4 rotate-180" />
                    Import
                  </Button> */}
                </div>
              </div>

              {/* Mobile: new product form appears under the add button row */}
              {isMobile && isCreatingNew && (
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <ProductForm variant="inline" />
                </div>
              )}
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 pt-0 space-y-2">
                {localProducts.map((product) => (
                  <div key={product.id}>
                    <div
                      className={cn(
                        'relative rounded-lg border-2 cursor-pointer transition-colors overflow-hidden',
                        selectedProductId === product.id && !isCreatingNew
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border hover:border-muted-foreground/50'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectProduct(product.id);
                      }}
                    >
                      <div className="flex">
                        <div className="w-20 h-20 bg-muted flex-shrink-0 overflow-hidden">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 px-3 pt-1 pb-3">
                          <h4 className="text-base text-muted-foreground truncate">
                            {product.name || 'Untitled Product'}
                          </h4>
                          <p className="text-sm text-muted-foreground/70 truncate">{product.sku}</p>
                        </div>
                      </div>

                      {!isMobile && selectedProductId === product.id && !isCreatingNew && (
                        <div className="absolute bottom-2 right-2 flex gap-0.5 bg-background rounded-md shadow-md border border-border p-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateProduct(product.id);
                            }}
                            className="p-1.5 hover:bg-muted rounded transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                            className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveProduct(product.id, 'up');
                            }}
                            disabled={selectedIndex === 0}
                            className="p-1.5 hover:bg-muted rounded transition-colors disabled:opacity-50"
                            title="Move up"
                          >
                            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveProduct(product.id, 'down');
                            }}
                            disabled={selectedIndex === localProducts.length - 1}
                            className="p-1.5 hover:bg-muted rounded transition-colors disabled:opacity-50"
                            title="Move down"
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile: inline edit form */}
                    {isMobile && expandedProductId === product.id && !isCreatingNew && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <ProductForm variant="inline" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Desktop: right side panel */}
          {!isMobile && (
            <div className="flex-1 p-6 overflow-y-auto">
              <ProductForm variant="panel" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button-2';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils';
import { X, Plus, Copy, Trash2, ChevronUp, ChevronDown, Upload, Image, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

const generateId = () => `line-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createEmptyLineItem = () => ({
  id: generateId(),
  name: '',
  sku: Math.random().toString(36).substr(2, 5),
  price: 10,
  stock: 1,
  minQuantity: 1,
  maxQuantity: null,
  images: [],
});

const LineItemForm = ({ 
  variant, 
  currentLineItem, 
  handleUpdateLineItem, 
  handleAddImage, 
  handleRemoveImage, 
}) => {
  if (!currentLineItem) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Виберіть позицію або додайте нову
      </div>
    );
  }

  return (
    <div 
      className={cn('space-y-6', variant === 'inline' && 'px-4 pb-4 pt-3 border-t border-border bg-background')}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-medium text-foreground">
        Редагування позиції
      </h3>

      {/* Name */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          Name<span className="text-destructive">*</span>
        </Label>
        <Input
          value={currentLineItem.name}
          onChange={(e) => handleUpdateLineItem('name', e.target.value)}
          placeholder="Назва позиції"
          className="bg-muted/50"
        />
      </div>

      {/* SKU */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          SKU<span className="text-destructive">*</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Stock Keeping Unit - унікальний ідентифікатор</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Input
          value={currentLineItem.sku}
          onChange={(e) => handleUpdateLineItem('sku', e.target.value)}
          placeholder="sku-123"
          className="bg-muted/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">Price*</Label>
          <Input
            type="number"
            value={currentLineItem.price}
            onChange={(e) => handleUpdateLineItem('price', parseFloat(e.target.value) || 0)}
            onFocus={(e) => e.target.select()}
            className="bg-muted/50"
          />
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Stock
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Available quantity in stock</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            type="number"
            value={currentLineItem.stock}
            onChange={(e) => handleUpdateLineItem('stock', parseInt(e.target.value) || 0)}
            onFocus={(e) => e.target.select()}
            className="bg-muted/50"
          />
        </div>

        {/* Min Quantity */}
        <div className="space-y-2">
          <Label>Minimum Quantity / Order</Label>
          <p className="text-xs text-muted-foreground flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            If this line item is selected, the submitter must order at least the minimum quantity or more.
          </p>
          <Input
            type="number"
            value={currentLineItem.minQuantity}
            onChange={(e) => handleUpdateLineItem('minQuantity', parseInt(e.target.value) || 1)}
            min={1}
            className="bg-muted/50"
          />
        </div>

        {/* Max Quantity */}
        <div className="space-y-2">
          <Label>Maximum Quantity / Order</Label>
          <p className="text-xs text-muted-foreground flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            If this line item is selected, the submitter can only order the maximum quantity or less.
          </p>
          <Input
            type="number"
            value={currentLineItem.maxQuantity ?? ''}
            onChange={(e) => handleUpdateLineItem('maxQuantity', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="-"
            className="bg-muted/50"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <Label>Images</Label>
        <div className="flex flex-wrap gap-2">
          {currentLineItem.images.map((img, i) => (
            <div key={i} className="relative group">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleAddImage} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Images
        </Button>
      </div>
    </div>
  );
};

export const ManageLineItemsPopup = ({
  lineItems,
  onUpdateLineItems,
  onClose,
}) => {
  const isMobile = useIsMobile();
  const [localLineItems, setLocalLineItems] = useState(lineItems);
  const [selectedLineItemId, setSelectedLineItemId] = useState(null);
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    if (localLineItems.length > lineItems.length) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [localLineItems.length]);

  // Додаємо в кінець списку (вниз)
  const handleAddLineItem = () => {
    const newLineItem = createEmptyLineItem();
    setLocalLineItems((prev) => [...prev, newLineItem]);
    
    // Додаємо перевірку: якщо це НЕ мобільна версія, тоді робимо позицію активною
    if (!isMobile) {
      setSelectedLineItemId(newLineItem.id);
    }
  };

  const handleSelectLineItem = (e, id) => {
    e.stopPropagation();
    setSelectedLineItemId(prev => prev === id ? null : id);
  };

  const handleUpdateLineItem = (field, value) => {
    if (selectedLineItemId) {
      setLocalLineItems((prev) =>
        prev.map((p) => (p.id === selectedLineItemId ? { ...p, [field]: value } : p))
      );
    }
  };

  const handleDuplicateLineItem = (e, id) => {
    e.stopPropagation();
    const lineItem = localLineItems.find((p) => p.id === id);
    if (lineItem) {
      const duplicated = {
        ...lineItem,
        id: generateId(),
        name: lineItem.name ? `${lineItem.name} (копія)` : '',
        sku: `${lineItem.sku}-copy`,
      };
      const index = localLineItems.findIndex((p) => p.id === id);
      const newLineItems = [...localLineItems];
      newLineItems.splice(index + 1, 0, duplicated);
      setLocalLineItems(newLineItems);
      setSelectedLineItemId(duplicated.id);
    }
  };

  const handleDeleteLineItem = (e, id) => {
    e.stopPropagation();
    const updated = localLineItems.filter((p) => p.id !== id);
    setLocalLineItems(updated);
    if (selectedLineItemId === id) setSelectedLineItemId(null);
  };

  const handleMoveLineItem = (e, id, direction) => {
    e.stopPropagation();
    const index = localLineItems.findIndex((p) => p.id === id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localLineItems.length) return;

    const newLineItems = [...localLineItems];
    [newLineItems[index], newLineItems[newIndex]] = [newLineItems[newIndex], newLineItems[index]];
    setLocalLineItems(newLineItems);
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = e.target.files;
      if (files && selectedLineItemId) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const url = ev.target?.result;
            setLocalLineItems((prev) =>
              prev.map((p) =>
                p.id === selectedLineItemId ? { ...p, images: [...p.images, url] } : p
              )
            );
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  const handleRemoveImage = (imageIndex) => {
    if (selectedLineItemId) {
      setLocalLineItems((prev) =>
        prev.map((p) =>
          p.id === selectedLineItemId
            ? { ...p, images: p.images.filter((_, i) => i !== imageIndex) }
            : p
        )
      );
    }
  };

  const handleClose = () => {
    onUpdateLineItems(localLineItems);
    onClose();
  };

  const currentLineItem = localLineItems.find((p) => p.id === selectedLineItemId) || null;
  const selectedIndex = localLineItems.findIndex((p) => p.id === selectedLineItemId);

  return (
    <div
      className={cn('fixed inset-0 z-[100] flex items-center justify-center', isMobile ? 'p-3' : 'p-8')}
      onClick={handleClose}
    >
      <div className="fixed inset-0 bg-foreground/50" />

      <div
        className={cn('relative bg-background rounded-2xl shadow-2xl flex flex-col', isMobile ? 'w-full' : 'w-[90vw] max-w-[1100px]')}
        style={{ height: isMobile ? 'calc(100vh - 24px)' : 'calc(100vh - 64px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Керування позиціями</h2>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className={cn('flex-1 flex overflow-hidden', isMobile && 'flex-col')}>
          {/* Список */}
          <div 
            className={cn('flex flex-col', isMobile ? 'w-full' : 'w-[380px] border-r border-border')}
            onClick={() => setSelectedLineItemId(null)}
          >
            <div className="px-4 py-3 border-b border-border bg-background" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between gap-2">
                <Button onClick={handleAddLineItem} className="gap-2 bg-primary">
                  <Plus className="w-4 h-4" />
                  Додати позицію
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Імпорт / Експорт
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {localLineItems.map((lineItem) => (
                  <div key={lineItem.id}>
                    <div
                      className={cn(
                        'relative rounded-lg border-2 cursor-pointer transition-all overflow-hidden bg-background',
                        selectedLineItemId === lineItem.id ? 'border-primary!' : 'border-border hover:border-muted-foreground/30'
                      )}
                      onClick={(e) => handleSelectLineItem(e, lineItem.id)}
                    >
                      <div className="flex">
                        <div className="w-20 h-20 bg-muted flex-shrink-0 overflow-hidden">
                          {lineItem.images[0] ? (
                            <img src={lineItem.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 px-3 pt-1 pb-2">
                          <h4 className="text-base font-medium truncate">
                            {lineItem.name || 'Нова позиція'}
                          </h4>
                          <p className="text-sm text-muted-foreground/70 truncate">{lineItem.sku}</p>
                          <p className="text-sm font-medium mt-1">{lineItem.price} грн</p>
                        </div>
                      </div>

                      {selectedLineItemId === lineItem.id && (
                        <div 
                          className="absolute bottom-2 right-2 flex gap-0.5 bg-background rounded-md shadow-md border border-border p-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button onClick={(e) => handleDuplicateLineItem(e, lineItem.id)} className="p-1.5 hover:bg-muted rounded">
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button onClick={(e) => handleDeleteLineItem(e, lineItem.id)} className="p-1.5 hover:bg-destructive/10 rounded">
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </button>
                          <button onClick={(e) => handleMoveLineItem(e, lineItem.id, 'up')} disabled={selectedIndex === 0} className="p-1.5 hover:bg-muted rounded disabled:opacity-30">
                            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button onClick={(e) => handleMoveLineItem(e, lineItem.id, 'down')} disabled={selectedIndex === localLineItems.length - 1} className="p-1.5 hover:bg-muted rounded disabled:opacity-30">
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isMobile && selectedLineItemId === lineItem.id && (
                      <LineItemForm 
                        variant="inline"
                        currentLineItem={lineItem}
                        handleUpdateLineItem={handleUpdateLineItem}
                        handleAddImage={handleAddImage}
                        handleRemoveImage={handleRemoveImage}
                      />
                    )}
                  </div>
                ))}
                <div ref={scrollAnchorRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Панель для десктопа */}
          {!isMobile && (
            <div className="flex-1 p-6 overflow-y-auto bg-background" onClick={() => setSelectedLineItemId(null)}>
              <LineItemForm 
                variant="panel"
                currentLineItem={currentLineItem}
                handleUpdateLineItem={handleUpdateLineItem}
                handleAddImage={handleAddImage}
                handleRemoveImage={handleRemoveImage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

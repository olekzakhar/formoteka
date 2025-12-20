import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ManageProductsPopup } from './ManageProductsPopup';
import { cn } from '@/lib/utils';
import { List, LayoutGrid, Package } from 'lucide-react';

const layoutOptions = [
  {
    value: 'list',
    label: 'List View',
    icon: <List className="w-4 h-4" />,
    description: 'Small photo on left with name and price',
  },
  {
    value: 'grid-2',
    label: '2 Cards per Row',
    icon: <LayoutGrid className="w-4 h-4" />,
    description: 'Photo on top, name and price below',
  },
  {
    value: 'grid-3',
    label: '3 Cards per Row',
    icon: <LayoutGrid className="w-4 h-4" />,
    description: 'Photo on top, name and price below',
  },
];

export const ProductsBlockSettings = ({ block, onUpdate }) => {
  const [showManageProducts, setShowManageProducts] = useState(false);

  const products = block.products || [];
  const layout = block.productsLayout || 'grid-2';

  const handleLayoutChange = (newLayout) => {
    onUpdate({ productsLayout: newLayout });
  };

  const handleUpdateProducts = (newProducts) => {
    onUpdate({ products: newProducts });
  };

  return (
    <div className="space-y-6">
      {/* Manage Products Button */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50">
          <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-soft">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Продукти</p>
            <p className="text-xs text-muted-foreground">{products.length} продуктів</p>
          </div>
        </div>

        <Button
          onClick={() => setShowManageProducts(true)}
          className="w-full"
        >
          Керування продуктами
        </Button>
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground">Appearance</h4>
        </div>

        {/* Layout Options */}
        <div className="space-y-2">
          <Label>Choose Layout</Label>
          <div className="space-y-2">
            {layoutOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleLayoutChange(option.value)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-colors text-left',
                  layout === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0',
                    layout === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  {option.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manage Products Popup */}
      {showManageProducts && (
        <ManageProductsPopup
          products={products}
          onUpdateProducts={handleUpdateProducts}
          onClose={() => setShowManageProducts(false)}
        />
      )}
    </div>
  );
};

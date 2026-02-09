import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/Switch'
import { ArrowRight } from 'lucide-react'

export const SubmitButtonSettings = ({
  buttonText,
  onButtonTextChange,
  formDesign,
  onUpdateDesign,
  hasLineItemsBlock = false,
  totalQuantity = 0,
  totalAmount = 0,
}) => {
  const showLineItemInfo = formDesign.stickyButton && hasLineItemsBlock && totalQuantity > 0;
  const displayButtonText = formDesign.stickyButton && hasLineItemsBlock ? 'Замовити' : buttonText;

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Preview */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground mb-3">Перегляд</p>
        
        {formDesign.stickyButton ? (
          <div className="relative bg-card rounded-xl border border-border overflow-hidden w-full">
            {/* Mock content area */}
            <div className="h-24 bg-muted/30 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Вміст форми</span>
            </div>
            
            {/* Sticky button preview */}
            <div className="p-3 border-t border-border">
              <Button
                variant="black"
                size="black"
                className="w-full flex items-center justify-between"
              >
                {showLineItemInfo && (
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted-foreground/30 text-sm">
                    {totalQuantity}
                  </span>
                )}
                <span className="flex-1 text-center">{displayButtonText}</span>
                {showLineItemInfo ? (
                  <span className="text-sm font-medium">${totalAmount.toFixed(2)}</span>
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="black"
            size="black"
          >
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Sticky Button Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">Закріплена кнопка</label>
            <p className="text-xs text-muted-foreground -mt-[6px]">
              Закріплено внизу екрана
            </p>
          </div>
          <Switch
            checked={formDesign.stickyButton}
            onCheckedChange={(checked) => onUpdateDesign({ stickyButton: checked })}
            big
          />
        </div>
        
        {formDesign.stickyButton && (
          <div className="p-3 bg-primary/30 opacity-85 rounded-lg">
            <p className="text-xs">
              Коли є блок Позиції, кнопка показує загальну кількість і суму.
            </p>
          </div>
        )}
      </div>

      {/* Button text */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Текст кнопки</label>
        <input
          type="text"
          value={buttonText}
          onChange={(e) => onButtonTextChange(e.target.value)}
          className={cn(
            'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'transition-smooth'
          )}
        />
        {formDesign.stickyButton && hasLineItemsBlock && (
          <p className="text-xs text-muted-foreground">
            Після вибору товарів текст кнопки автоматично змінюється на “Замовити”.
          </p>
        )}
      </div>

      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          Ця кнопка завжди відображається в кінці форми, її не можна перемістити або видалити
        </p>
      </div>
    </div>
  );
};

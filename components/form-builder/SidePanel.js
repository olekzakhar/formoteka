// components/form-builder/SidePanel

import { TabsAdd } from '@/components/form-builder/tabs/Add';
import { TabsBlockSettings } from '@/components/form-builder/tabs/BlockSettings';
import { TabsSettings } from '@/components/form-builder/tabs/Settings';
import { TabsDesign } from '@/components/form-builder/tabs/Design';
import { SubmitButtonSettings } from '@/components/form-builder/SubmitButtonSettings';
import { cn } from '@/utils';
import { PaintbrushVertical, Settings, ArrowLeft, Plus } from 'lucide-react';

const PANEL_WIDTH = 'w-full md:w-[280px] lg:w-[360px] md:h-[calc(100%-16px)] md:mt-[8px] md:mr-[10px] rounded-3xl border';


export const SidePanel = ({
  activeTab,
  onTabChange,
  activeBlock,
  activeSuccessBlock,
  showBlockSettings,
  showSubmitSettings,
  showSuccessBlockSettings,
  submitButtonText,
  onSubmitButtonTextChange,
  onCloseBlockSettings,
  onCloseSubmitSettings,
  onCloseSuccessBlockSettings,
  onAddBlock,
  onUpdateBlock,
  onUpdateSuccessBlock,
  formDesign,
  onUpdateDesign,
  formSeo,
  onUpdateSeo,
  deliveryTargets,
  onUpdateDeliveryTargets,
  hasProductsBlock = false,
  onOpenSubmitSettings,
}) => {
  // Render Block Settings view (for form blocks)
  if (showBlockSettings && activeBlock) {
    return (
      <div className={cn(PANEL_WIDTH, 'h-full bg-card border-l border-border flex flex-col shrink-0')}>
        <div className="flex items-center gap-2 px-4 py-[11px] border-b border-border">
          <button
            onClick={onCloseBlockSettings}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Параметри блоку</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <TabsBlockSettings block={activeBlock} onUpdate={onUpdateBlock} />
        </div>
      </div>
    );
  }

  // Render Success Block Settings view
  if (showSuccessBlockSettings && activeSuccessBlock) {
    return (
      <div className={cn(PANEL_WIDTH, 'h-full bg-card border-l border-border flex flex-col shrink-0')}>
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
          <button
            onClick={onCloseSuccessBlockSettings}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Success Block Settings</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <TabsBlockSettings block={activeSuccessBlock} onUpdate={onUpdateSuccessBlock} />
        </div>
      </div>
    );
  }

  // Render Submit Button Settings view
  if (showSubmitSettings) {
    return (
      <div className={cn(PANEL_WIDTH, 'h-full bg-card border-l border-border flex flex-col shrink-0')}>
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
          <button
            onClick={onCloseSubmitSettings}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Кнопка відправки</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SubmitButtonSettings
            buttonText={submitButtonText}
            onButtonTextChange={onSubmitButtonTextChange}
            formDesign={formDesign}
            onUpdateDesign={onUpdateDesign}
            hasProductsBlock={hasProductsBlock}
            totalQuantity={1}
            totalAmount={9.99}
          />
        </div>
      </div>
    );
  }

  // Render main tabs (Add + Design + Settings)
  return (
    <div className={cn(PANEL_WIDTH, 'h-full bg-card border-l border-border flex flex-col shrink-0 overflow-hidden')}>
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => onTabChange('add')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-smooth',
            activeTab === 'add'
              ? 'text-primary border-b-2 border-primary! bg-accent/70'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          <Plus className="w-4 h-4" />
          Додати
        </button>
        <button
          onClick={() => onTabChange('design')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-smooth',
            activeTab === 'design'
              ? 'text-primary border-b-2 border-primary! bg-accent/70'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          <PaintbrushVertical className="w-4 h-4" />
          Дизайн
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-smooth',
            activeTab === 'settings'
              ? 'text-primary border-b-2 border-primary! bg-accent/70'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          <Settings className="w-4 h-4" />
          <span className="hidden lg:inline-block">Параметри</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'add' ? (
          <TabsAdd onAddBlock={onAddBlock} />
        ) : activeTab === 'design' ? (
          <TabsDesign design={formDesign} onUpdateDesign={onUpdateDesign} />
        ) : (
          <TabsSettings
            formDesign={formDesign}
            onUpdateDesign={onUpdateDesign}
            seo={formSeo}
            onUpdateSeo={onUpdateSeo}
            delivery={deliveryTargets}
            onUpdateDelivery={onUpdateDeliveryTargets}
            onOpenSubmitSettings={onOpenSubmitSettings}
          />
        )}
      </div>
    </div>
  );
};

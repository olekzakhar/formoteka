// components/form-builder/SidePanel

import { TabsAdd } from '@/components/form-builder/tabs/Add'
import { BlockSettings } from '@/components/form-builder/block/Settings'
import { TabsSettings } from '@/components/form-builder/tabs/Settings'
import { TabsDesign } from '@/components/form-builder/tabs/Design'
import { SubmitButtonSettings } from '@/components/form-builder/SubmitButtonSettings'
import { cn } from '@/utils'
import { PaintbrushVertical, Settings, ArrowLeft, PackagePlus } from 'lucide-react'

const PANEL_WIDTH = 'w-full md:w-[280px] lg:w-[360px] md:h-[calc(100%-16px)] md:mt-[8px] md:mr-[10px] rounded-3xl border'


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
  isPublic,
  onUpdateIsPublic,
  hasLineItemsBlock = false,
  onOpenSubmitSettings,
}) => {
  // Render Block Settings view (for form blocks)
  if (showBlockSettings && activeBlock) {
    return (
      <div key="block-settings" className={cn(PANEL_WIDTH, 'h-full bg-[#FDFEFE] border-l border-border flex flex-col shrink-0')}>
        <div className="flex items-center gap-2 pl-3.5 pr-4 py-[11px] border-b border-border">
          <button
            onClick={onCloseBlockSettings}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth shrink-0 w-7 h-7 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Параметри блоку</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <BlockSettings block={activeBlock} onUpdate={onUpdateBlock} />
        </div>
      </div>
    );
  }

  // Render Success Block Settings view
  if (showSuccessBlockSettings && activeSuccessBlock) {
    return (
      <div key="success-block-settings" className={cn(PANEL_WIDTH, 'h-full bg-[#FDFEFE] border-l border-border flex flex-col shrink-0')}>
        <div className="flex items-center gap-2 pl-3.5 pr-4 py-[11px] border-b border-border">
          <button
            onClick={onCloseSuccessBlockSettings}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth shrink-0 w-7 h-7 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Параметри блоку</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <BlockSettings block={activeSuccessBlock} onUpdate={onUpdateSuccessBlock} />
        </div>
      </div>
    );
  }

  // Render Submit Button Settings view
  if (showSubmitSettings) {
    return (
      <div key="submit-settings" className={cn(PANEL_WIDTH, 'h-full bg-[#FDFEFE] border-l border-border flex flex-col shrink-0')}>
        <div className="flex items-center gap-2 pl-3.5 pr-4 py-[11px] border-b border-border">
          <button
            onClick={onCloseSubmitSettings}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth shrink-0 w-7 h-7 flex items-center justify-center"
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
            hasLineItemsBlock={hasLineItemsBlock}
            totalQuantity={1}
            totalAmount={9.99}
          />
        </div>
      </div>
    );
  }

  const activeTabClasses = 'border-b-2 bg-primary/[0.25] border-black/[0.8]! text-black/[0.8]'
  const noActiveTabClasses = 'text-muted-foreground hover:text-black/[0.8] hover:bg-muted/50'

  // Render main tabs (Add + Design + Settings)
  return (
    <div key="main-tabs" className={cn(PANEL_WIDTH, 'h-full bg-[#FDFEFE] border-l border-border flex flex-col shrink-0 overflow-hidden')}>
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => onTabChange('add')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 pl-2 pr-3 py-3.5 text-sm font-medium transition-smooth',
            activeTab === 'add'
              ? activeTabClasses
              : noActiveTabClasses
          )}
        >
          <PackagePlus className="w-4 h-4" />
          Додати
        </button>
        <button
          onClick={() => onTabChange('design')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 pl-2 pr-3 py-3.5 text-sm font-medium transition-smooth',
            activeTab === 'design'
              ? activeTabClasses
              : noActiveTabClasses
          )}
        >
          <PaintbrushVertical className="w-4 h-4" />
          Дизайн
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 pl-2 pr-3 py-3.5 text-sm font-medium transition-smooth',
            activeTab === 'settings'
              ? activeTabClasses
              : noActiveTabClasses
          )}
        >
          <Settings className="w-4 h-4" />
          Параметри
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
            isPublic={isPublic}
            onUpdateIsPublic={onUpdateIsPublic}
            onOpenSubmitSettings={onOpenSubmitSettings}
          />
        )}
      </div>
    </div>
  )
}

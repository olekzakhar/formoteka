import { AddBlockTab } from './AddBlockTab';
import { BlockSettingsTab } from './BlockSettingsTab';
import { DesignTab, FormDesign } from './DesignTab';
import { cn } from '@/lib/utils';
import { Blocks, Palette, ArrowLeft } from 'lucide-react';

export const SidePanel = ({
  activeTab,
  onTabChange,
  activeBlock,
  showBlockSettings,
  onCloseBlockSettings,
  onAddBlock,
  onUpdateBlock,
  formDesign,
  onUpdateDesign,
}) => {
  return (
    <div className="w-[340px] h-full bg-card border-l border-border flex flex-col shadow-panel">
      {showBlockSettings && activeBlock ? (
        <>
          {/* Block Settings Header */}
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
            <button
              onClick={onCloseBlockSettings}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-foreground">Block Settings</span>
          </div>
          
          {/* Block Settings Content */}
          <div className="flex-1 overflow-y-auto">
            <BlockSettingsTab block={activeBlock} onUpdate={onUpdateBlock} />
          </div>
        </>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => onTabChange('add')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-smooth',
                activeTab === 'add'
                  ? 'text-primary border-b-2 border-primary bg-accent/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Blocks className="w-4 h-4" />
              Add Block
            </button>
            <button
              onClick={() => onTabChange('design')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-smooth',
                activeTab === 'design'
                  ? 'text-primary border-b-2 border-primary bg-accent/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Palette className="w-4 h-4" />
              Design
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'add' ? (
              <AddBlockTab onAddBlock={onAddBlock} />
            ) : (
              <DesignTab design={formDesign} onUpdateDesign={onUpdateDesign} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

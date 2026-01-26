// components/form-builder/tabs/AddBlock

import { blockDefinitions } from '@/data/block-definitions';
import { BlockIcon } from '@/components/form-builder/block/ButtonIcons';
import { cn } from '@/utils';

const categories = [
  { key: 'content', label: 'Контент' },
  { key: 'input', label: 'Поля вводу' },
  { key: 'choice', label: 'Поля вибору' },
  { key: 'layout', label: 'Макет' },
];

export const TabsAdd = ({ onAddBlock }) => {
  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {categories.map((category) => {
        const blocks = blockDefinitions.filter((b) => b.category === category.key);
        return (
          <div key={category.key}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {category.label}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {blocks.map((block) => (
                <button
                  key={block.type}
                  onClick={() => onAddBlock(block.type)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('blockType', block.type);
                    // Safari/Firefox compatibility
                    e.dataTransfer.setData('text/plain', block.type);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg',
                    'bg-primary/[0.08] hover:bg-primary/15 border border-primary/25! hover:border-primary/40!',
                    'transition-smooth cursor-grab active:cursor-grabbing',
                    'group'
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shadow-soft group-hover:shadow-medium transition-smooth">
                    <BlockIcon icon={block.icon} className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-smooth" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{block.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// components/form-builder/tabs/Add

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
  // Функція щоб створити копію кнопки блока який перетягую в редактор і щоб додати завкруглені краї
  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('blockType', blockType)
    e.dataTransfer.setData('text/plain', blockType)
    e.dataTransfer.effectAllowed = 'copy'

    // Створюємо кастомний drag image з заокругленнями
    const dragElement = e.currentTarget.cloneNode(true)
    dragElement.style.position = 'absolute'
    dragElement.style.top = '-9999px'
    dragElement.style.width = e.currentTarget.offsetWidth + 'px'
    dragElement.style.height = e.currentTarget.offsetHeight + 'px'
    dragElement.style.borderRadius = '0.5rem' // rounded-lg
    dragElement.style.opacity = '0.9'
    
    document.body.appendChild(dragElement)
    
    // Встановлюємо кастомний drag image
    e.dataTransfer.setDragImage(dragElement, e.currentTarget.offsetWidth / 2, e.currentTarget.offsetHeight / 2)
    
    // Видаляємо тимчасовий елемент після початку перетягування
    setTimeout(() => {
      document.body.removeChild(dragElement)
    }, 0)
  }

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
                  onDragStart={(e) => handleDragStart(e, block.type)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg',
                    'bg-primary/[0.08] hover:bg-primary/15 border border-primary/20! hover:border-primary/40!',
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

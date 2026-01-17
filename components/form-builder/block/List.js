import * as LucideIcons from 'lucide-react';
import { Circle, Minus } from 'lucide-react';

export const BlockList = ({ block, isPreview }) => {
  const items = block.listItems || [];
  const style = block.listStyle || 'icon';
  const iconName = block.listIcon || 'Check';
  const iconColor = block.listIconColor || '#22c55e';

  const IconComponent = (LucideIcons)[iconName];

  const renderMarker = () => {
    if (style === 'bullet') {
      return <Circle className="w-2 h-2 fill-current shrink-0" style={{ color: iconColor }} />;
    }
    if (style === 'dash') {
      return <Minus className="w-4 h-4 shrink-0" style={{ color: iconColor }} />;
    }
    // icon style
    if (IconComponent) {
      return <IconComponent className="w-5 h-5 shrink-0" style={{ color: iconColor }} />;
    }
    return <Circle className="w-2 h-2 fill-current shrink-0" style={{ color: iconColor }} />;
  };

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground text-sm py-2">
        No list items. Add items in settings.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="mt-0.5 flex items-center justify-center">
            {renderMarker()}
          </span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
};

// Available icons for list items
export const listIconOptions = [
  'Check',
  'CheckCircle',
  'CheckSquare',
  'ChevronRight',
  'ArrowRight',
  'Star',
  'Heart',
  'Zap',
  'Target',
  'Award',
  'ThumbsUp',
  'Sparkles',
  'Rocket',
  'Flag',
  'Bookmark',
];

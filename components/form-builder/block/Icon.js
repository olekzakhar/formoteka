import * as LucideIcons from 'lucide-react';

export const BlockIcon = ({ block }) => {
  const iconName = block.iconName || 'CheckCircle';
  const size = block.iconSize ?? 32;
  const color = block.iconColor || '#22c55e';
  const bgColor = block.iconBgColor || '#22c55e';
  const bgOpacity = block.iconBgOpacity ?? 15;
  const padding = block.iconBgPadding ?? 16;
  const shape = block.iconBgShape || 'circle';
  const customRadius = block.iconBgRadius ?? 8;

  // Get icon component from lucide-react
  const Icon = (LucideIcons)[iconName];

  const getBorderRadius = () => {
    switch (shape) {
      case 'square':
        return customRadius;
      case 'rounded':
        return customRadius;
      case 'circle':
        return '9999px';
      default:
        return '9999px';
    }
  };

  // Convert hex to rgba for background
  const hexToRgba = (hex, opacity) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(34, 197, 94, ${opacity / 100})`;
    return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity / 100})`;
  };

  return (
    <div className="flex justify-center">
      <div
        className="flex items-center justify-center"
        style={{
          width: size + padding * 2,
          height: size + padding * 2,
          borderRadius: getBorderRadius(),
          backgroundColor: hexToRgba(bgColor, bgOpacity),
        }}
      >
        {Icon ? (
          <Icon style={{ width: size, height: size, color }} />
        ) : (
          <div
            className="bg-muted rounded flex items-center justify-center text-xs text-muted-foreground"
            style={{ width: size, height: size }}
          >
            ?
          </div>
        )}
      </div>
    </div>
  );
};

// Available icons list for the picker
export const availableIcons = [
  'CheckCircle', 'Check', 'CheckCheck', 'CircleCheck',
  'Star', 'Heart', 'ThumbsUp', 'Trophy', 'Award', 'Medal',
  'Smile', 'PartyPopper', 'Sparkles', 'Gift', 'Crown',
  'Rocket', 'Zap', 'Flame', 'Sun', 'Moon',
  'Bell', 'Mail', 'Send', 'MessageCircle', 'Phone',
  'Home', 'Building', 'MapPin', 'Globe', 'Compass',
  'User', 'Users', 'UserCheck', 'UserPlus',
  'ShoppingCart', 'ShoppingBag', 'CreditCard', 'Wallet', 'Package',
  'Lock', 'Shield', 'Key', 'Eye', 'EyeOff',
  'Settings', 'Cog', 'Wrench', 'Tool',
  'Calendar', 'Clock', 'Timer', 'Hourglass',
  'File', 'FileText', 'Folder', 'Download', 'Upload',
  'Image', 'Camera', 'Video', 'Music', 'Headphones',
  'Wifi', 'Bluetooth', 'Battery', 'Power',
  'AlertCircle', 'AlertTriangle', 'Info', 'HelpCircle', 'XCircle',
  'Play', 'Pause', 'Square', 'Circle', 'Triangle',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
  'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown',
  'Plus', 'Minus', 'X', 'Menu', 'MoreHorizontal',
  'Code', 'Terminal', 'Database', 'Server', 'Cloud',
  'Bookmark', 'Flag', 'Tag', 'Hash', 'AtSign',
];

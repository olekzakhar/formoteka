import { cn } from '@/utils'
import { User } from 'lucide-react'

export const BlockAvatar = ({ block }) => {
  const size = block.avatarSize ?? 64;
  const align = block.avatarAlign ?? 'center';
  const radius = block.avatarRadius ?? 'circle';
  const position = block.avatarPosition ?? { x: 50, y: 50 };
  const hasImage = Boolean(block.avatarImage);

  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  const radiusClass = {
    none: 'rounded-none',
    small: 'rounded-lg',
    medium: 'rounded-2xl',
    circle: 'rounded-full',
  }[radius];

  return (
    <div className={cn('flex', alignClass)}>
      <div
        className={cn(
          'overflow-hidden flex items-center justify-center bg-muted/50 border border-border',
          radiusClass
        )}
        style={{ width: size, height: size }}
      >
        {hasImage ? (
          <img
            src={block.avatarImage}
            alt="Avatar"
            className="w-full h-full object-cover"
            style={{ objectPosition: `${position.x}% ${position.y}%` }}
            draggable={false}
          />
        ) : (
          <User className="w-1/2 h-1/2 text-muted-foreground" />
        )}
      </div>
    </div>
  )
}

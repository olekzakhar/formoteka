import { Eye, Edit3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const FormHeader = ({ isPreview, onTogglePreview }) => {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-6 shrink-0">
      <h1 className="text-lg font-semibold text-foreground">Formoteka</h1>
      
      {/* Center navigation link */}
      <nav className="mr-8 flex-1 flex items-center justify-end gap-6">
        <a
          href="#settings"
          className={cn(
            "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </a>
      </nav>

      <Button
        variant={isPreview ? 'default' : 'outline'}
        size="sm"
        onClick={onTogglePreview}
        className="gap-2"
      >
        {isPreview ? (
          <>
            <Edit3 className="h-4 w-4" />
            Edit
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            Preview
          </>
        )}
      </Button>
    </header>
  );
};

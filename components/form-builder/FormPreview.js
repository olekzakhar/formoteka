import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export const FormPreview = ({ blocks }) => {
  if (blocks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-canvas">
        <p className="text-muted-foreground">No blocks to preview. Add some blocks first.</p>
      </div>
    );
  }

  const renderBlock = (block) => {
    switch (block.type) {
      case 'heading':
        return <h2 className="text-2xl font-semibold text-foreground">{block.label}</h2>;
      
      case 'paragraph':
        return <p className="text-muted-foreground">{block.label}</p>;
      
      case 'short-text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2">
            <Label className="text-foreground">
              {block.label}
              {block.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              type={block.type === 'email' ? 'email' : block.type === 'number' ? 'number' : 'text'}
              placeholder={block.placeholder}
              required={block.required}
            />
          </div>
        );
      
      case 'long-text':
        return (
          <div className="space-y-2">
            <Label className="text-foreground">
              {block.label}
              {block.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea placeholder={block.placeholder} required={block.required} />
          </div>
        );
      
      case 'date':
        return (
          <div className="space-y-2">
            <Label className="text-foreground">
              {block.label}
              {block.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input type="date" required={block.required} />
          </div>
        );
      
      case 'dropdown':
        return (
          <div className="space-y-2">
            <Label className="text-foreground">
              {block.label}
              {block.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={block.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {block.options?.map((option, idx) => (
                  <SelectItem key={idx} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-3">
            <Label className="text-foreground">
              {block.label}
              {block.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {block.options?.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox id={`${block.id}-${idx}`} />
                  <Label htmlFor={`${block.id}-${idx}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-3">
            <Label className="text-foreground">
              {block.label}
              {block.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup>
              {block.options?.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <RadioGroupItem value={option} id={`${block.id}-${idx}`} />
                  <Label htmlFor={`${block.id}-${idx}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-canvas overflow-auto">
      <div className="max-w-2xl mx-auto p-8">
        <form className="bg-card rounded-lg border border-border p-8 space-y-6 shadow-sm">
          {blocks.map((block) => (
            <div key={block.id}>{renderBlock(block)}</div>
          ))}
          <Button type="submit" className="w-full mt-4">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

// components/form-builder/tabs/Settings

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils';
import { Instagram, MessageCircle, Send, ChevronRight, Mail } from 'lucide-react';
import { TabsDesign } from '@/components/form-builder/tabs/Design';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const TabsSettings = ({
  formDesign,
  onUpdateDesign,
  seo,
  onUpdateSeo,
  delivery,
  onUpdateDelivery,
  isPublic,
  onUpdateIsPublic,
  onOpenSubmitSettings,
}) => {
  // FIXED: Safe access with optional chaining to prevent undefined errors
  const enabledMessengers = [
    delivery?.telegram?.enabled && 'telegram',
    delivery?.viber?.enabled && 'viber',
    delivery?.instagram?.enabled && 'instagram',
  ].filter(Boolean);

  // FIXED: Early return if delivery is not initialized
  if (!delivery || !delivery.telegram || !delivery.viber || !delivery.instagram) {
    return null;
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Top-level (outside collapsibles) */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">Увімкнути форму</label>
          <p className="text-xs text-muted-foreground -mt-[6px]">Коли увімкнено, форма доступна для користувачів</p>
        </div>
        <button
          onClick={() => onUpdateIsPublic(!isPublic)}
          className={cn(
            'relative w-11 h-6 shrink-0 rounded-full transition-smooth',
            isPublic ? 'bg-primary' : 'bg-muted'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow-soft transition-smooth',
              isPublic && 'translate-x-5'
            )}
          />
        </button>
      </div>

      {/* Submit Button Settings Link */}
      {onOpenSubmitSettings && (
        <button
          onClick={onOpenSubmitSettings}
          className={cn(
            'w-full flex items-center justify-between px-3 py-3 rounded-lg',
            'bg-muted/50 hover:bg-muted border border-border',
            'transition-smooth group'
          )}
        >
          <span className="text-sm font-medium text-foreground">Submit Button</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
        </button>
      )}

      <Accordion type="multiple" defaultValue={['seo', 'delivery']} className="w-full">
        <AccordionItem value="seo" className="border border-border rounded-lg px-3">
          <AccordionTrigger className="hover:no-underline">SEO (form page)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pb-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={seo.title}
                  onChange={(e) => onUpdateSeo({ title: e.target.value })}
                  placeholder="e.g. Contact Form — ACME"
                />
                <p className="text-xs text-muted-foreground">Recommended: under 60 characters.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Meta description</label>
                <Textarea
                  value={seo.description}
                  onChange={(e) => onUpdateSeo({ description: e.target.value })}
                  placeholder="A short summary of this form..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Recommended: under 160 characters.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery" className="border border-border rounded-lg px-3 mt-3">
          <AccordionTrigger className="hover:no-underline">Send orders to</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-3">
              {/* Radio group for Email vs Messengers */}
              <RadioGroup
                value={delivery.mode}
                onValueChange={(value) => onUpdateDelivery({ mode: value })}
                className="space-y-3"
              >
                {/* Email option */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="email" id="delivery-email" />
                    <Label htmlFor="delivery-email" className="mb-0! flex items-center gap-2 cursor-pointer">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>Email</span>
                    </Label>
                  </div>
                  {delivery.mode === 'email' && (
                    <Input
                      value={delivery.email}
                      onChange={(e) => onUpdateDelivery({ email: e.target.value })}
                      placeholder="your@email.com"
                      type="email"
                      className="ml-7"
                    />
                  )}
                </div>

                {/* Messengers option */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="messengers" id="delivery-messengers" />
                    <Label htmlFor="delivery-messengers" className="mb-0! cursor-pointer">
                      Messengers
                    </Label>
                  </div>
                  
                  {delivery.mode === 'messengers' && (
                    <div className="ml-7 space-y-2">
                      {/* Telegram */}
                      <div className="rounded-md border border-border bg-muted/20 px-3 py-2 space-y-2">
                        <label className="mb-0! flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={delivery.telegram.enabled}
                            onCheckedChange={(v) => {
                              const newEnabled = v === true;
                              // Prevent unchecking if it's the last one
                              if (!newEnabled && enabledMessengers.length === 1 && delivery.telegram.enabled) {
                                return;
                              }
                              onUpdateDelivery({ telegram: { ...delivery.telegram, enabled: newEnabled } });
                            }}
                            disabled={enabledMessengers.length === 1 && delivery.telegram.enabled}
                          />
                          <Send className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">Telegram</span>
                        </label>
                        {delivery.telegram.enabled && (
                          <Input
                            value={delivery.telegram.handle}
                            onChange={(e) =>
                              onUpdateDelivery({ telegram: { ...delivery.telegram, handle: e.target.value } })
                            }
                            placeholder="@username or chat ID"
                            className="mt-1"
                          />
                        )}
                      </div>

                      {/* Viber */}
                      <div className="rounded-md border border-border bg-muted/20 px-3 py-2 space-y-2">
                        <label className="mb-0! flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={delivery.viber.enabled}
                            onCheckedChange={(v) => {
                              const newEnabled = v === true;
                              // Prevent unchecking if it's the last one
                              if (!newEnabled && enabledMessengers.length === 1 && delivery.viber.enabled) {
                                return;
                              }
                              onUpdateDelivery({ viber: { ...delivery.viber, enabled: newEnabled } });
                            }}
                            disabled={enabledMessengers.length === 1 && delivery.viber.enabled}
                          />
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">Viber</span>
                        </label>
                        {delivery.viber.enabled && (
                          <Input
                            value={delivery.viber.handle}
                            onChange={(e) =>
                              onUpdateDelivery({ viber: { ...delivery.viber, handle: e.target.value } })
                            }
                            placeholder="Phone number"
                            className="mt-1"
                          />
                        )}
                      </div>

                      {/* Instagram */}
                      <div className="rounded-md border border-border bg-muted/20 px-3 py-2 space-y-2">
                        <label className="mb-0! flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={delivery.instagram.enabled}
                            onCheckedChange={(v) => {
                              const newEnabled = v === true;
                              // Prevent unchecking if it's the last one
                              if (!newEnabled && enabledMessengers.length === 1 && delivery.instagram.enabled) {
                                return;
                              }
                              onUpdateDelivery({ instagram: { ...delivery.instagram, enabled: newEnabled } });
                            }}
                            disabled={enabledMessengers.length === 1 && delivery.instagram.enabled}
                          />
                          <Instagram className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">Instagram</span>
                        </label>
                        {delivery.instagram.enabled && (
                          <Input
                            value={delivery.instagram.handle}
                            onChange={(e) =>
                              onUpdateDelivery({ instagram: { ...delivery.instagram, handle: e.target.value } })
                            }
                            placeholder="@username"
                            className="mt-1"
                          />
                        )}
                      </div>

                      {enabledMessengers.length > 1 && (
                        <p className="mt-3 text-xs bg-primary/30 px-2 py-1.5 opacity-85 rounded-md">
                          Обрано кілька месенджерів. До форми буде додано перемикач месенджерів.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

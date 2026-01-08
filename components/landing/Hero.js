// components/landing/Hero

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button-2";
import { ArrowRight, CheckCircle2, Package, ShoppingBag } from "lucide-react";
import heroFlowers from "@/public/landing/hero-flowers.jpg";
import heroCeramics from "@/public/landing/hero-ceramics.jpg";
import heroGift from "@/public/landing/hero-gift.jpg";
import heroCheese from "@/public/landing/hero-cheese.jpg";

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-4">
          {/* Left side - Content */}
          <div className="max-w-xl pt-[26px]">
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Для малого бізнесу
            </div>

            {/* Main headline */}
            <h1 className="animate-fade-up-delay-1 text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-foreground leading-[1.1] mb-5 tracking-tight">
              Не втрачайте
              <br />
              <span className="text-gradient">клієнтів</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-up-delay-2 text-base md:text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              Форма замовлення, яка перетворює інтерес клієнта на чітке замовлення.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-start gap-3">
              <Button asChild size="lg" className="group font-semibold px-6">
                <Link href="/forms" className="flex">
                  Створити форму
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="text-muted-foreground">
                Як це працює?
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Безкоштовний старт</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>5 хвилин на створення</span>
              </div>
              {/* <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Instagram Telegram</span>
              </div> */}
            </div>
          </div>

          {/* Right side - Asymmetric collage */}
          <div className="relative hidden lg:block">
            <div className="relative h-[520px] w-full">
              {/* Large main image - top right */}
              <div className="absolute top-0 right-0 w-[280px] h-[320px] rounded-2xl overflow-hidden shadow-elevated animate-fade-up z-10">
                <Image
                  src={heroFlowers} 
                  alt="Флорист створює букет" 
                  className="w-full h-full object-cover"
                  priority
                  quality={85}
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              
              {/* Medium image - top left */}
              <div className="absolute top-8 left-8 w-[200px] h-[180px] rounded-2xl overflow-hidden shadow-lg animate-fade-up-delay-1 z-20">
                <Image
                  src={heroCheese} 
                  alt="Крафтовий сир" 
                  className="w-full h-full object-cover"
                  loading="eager"
                  quality={80}
                  placeholder="blur"
                />
              </div>
              
              {/* Tall vertical image - bottom left */}
              <div className="absolute bottom-0 left-16 w-[180px] h-[260px] rounded-2xl overflow-hidden shadow-lg animate-fade-up-delay-2 z-30">
                <Image
                  src={heroGift} 
                  alt="Упаковка подарунка" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  quality={80}
                  placeholder="blur"
                />
              </div>
              
              {/* Square image - bottom right */}
              <div className="absolute bottom-8 right-16 w-[160px] h-[160px] rounded-2xl overflow-hidden shadow-lg animate-fade-up-delay-3 z-20">
                <Image
                  src={heroCeramics} 
                  alt="Керамічний виріб" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  quality={80}
                  placeholder="blur"
                />
              </div>

              {/* Order notification - floating top */}
              <div className="absolute top-2 left-[45%] -translate-x-1/2 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border/50 animate-fade-up-delay-2 z-40">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Нове замовлення!</div>
                    <div className="text-[10px] text-muted-foreground">Букет «Лаванда» × 1</div>
                  </div>
                </div>
              </div>
              
              {/* Payment notification - floating center */}
              <div className="absolute top-[45%] right-0 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border/50 animate-fade-up-delay-3 z-40">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Оплачено ✓</div>
                    <div className="text-[10px] text-muted-foreground">Сир «Бринза» — 320 ₴</div>
                  </div>
                </div>
              </div>

              {/* Decorative blurs */}
              <div className="absolute -bottom-4 left-1/2 w-40 h-40 rounded-full bg-primary/10 blur-3xl z-0" />
              <div className="absolute top-1/3 -right-8 w-24 h-24 rounded-full bg-primary/5 blur-2xl z-0" />
            </div>
          </div>
        </div>

        {/* Preview card */}
        <div className="mt-16 lg:mt-20 relative max-w-3xl mx-auto">
          <div className="relative bg-background rounded-2xl shadow-elevated border border-border/60 p-5 md:p-6">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Before */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">До</div>
                <MessageBubble variant="incoming" text="Привіт! Скільки коштує?" />
                <MessageBubble variant="outgoing" text="Вітаю! Що саме цікавить?" />
                <MessageBubble variant="incoming" text="Те, що вчора викладали" />
                <MessageBubble variant="outgoing" text="Їх було кілька, уточніть" />
                <MessageBubble variant="incoming" text="..." className="opacity-40" />
              </div>

              {/* After */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-3">Після</div>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-foreground">Нове замовлення</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <OrderRow label="Товар" value="Свічка «Лаванда»" />
                    <OrderRow label="Кількість" value="2 шт" />
                    <OrderRow label="Доставка" value="Нова Пошта, Київ" />
                    <OrderRow label="Телефон" value="+380 67 123 45 67" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile collage */}
        <div className="mt-12 lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="h-40 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src={heroFlowers} 
                  alt="Флорист" 
                  className="w-full h-full object-cover"
                  priority
                  quality={85}
                  placeholder="blur"
                />
              </div>
              <div className="h-28 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src={heroCheese} 
                  alt="Крафтовий сир" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  quality={80}
                  placeholder="blur"
                />
              </div>
            </div>
            <div className="space-y-3 pt-6">
              <div className="h-32 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src={heroCeramics} 
                  alt="Кераміка" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  quality={80}
                  placeholder="blur"
                />
              </div>
              <div className="h-36 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src={heroGift} 
                  alt="Упаковка подарунка" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  quality={80}
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
          
          {/* Mobile notification */}
          <div className="mt-4 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Нове замовлення!</div>
                <div className="text-[10px] text-muted-foreground">Букет «Лаванда» × 1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MessageBubble = ({ 
  variant, 
  text, 
  className = "" 
}) => {
  const isIncoming = variant === "incoming";
  
  return (
    <div className={`flex ${isIncoming ? "justify-start" : "justify-end"} ${className}`}>
      <div className={`
        max-w-[85%] px-3 py-2 rounded-2xl text-xs
        ${isIncoming 
          ? "bg-muted text-foreground rounded-bl-sm" 
          : "bg-foreground/5 text-foreground rounded-br-sm"
        }
      `}>
        {text}
      </div>
    </div>
  );
};

const OrderRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

export default HeroSection;

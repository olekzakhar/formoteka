// components/landing/Hero

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 md:pb-24 relative overflow-hidden bg-[#A3CAD5]">
      <div className="container relative">
        {/* Left side - Content */}
        <div className="mx-auto flex flex-col items-center max-w-2xl pt-[26px]">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.28] text-[#1C1C1C]/80 text-xs font-semibold mb-8 tracking-wide uppercase">
            {/* <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> */}
            <Zap className="w-3.5 h-3.5 text-[#1C1C1C]/80 animate-pulse" />
            Для малого бізнесу
          </div>

          {/* Main headline */}
          <h1 className="animate-fade-up-delay-1 text-4xl md:text-6xl font-extrabold text-center text-black leading-[1.1] mb-5 tracking-tight">
            Найпростіший спосіб створення форм
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up-delay-2 text-base md:text-xl text-[#1C1C1C] text-center max-w-xl mb-8 leading-relaxed">
            Попрощайтеся з нудними формами. Знайомтесь з інтуїтивно зрозумілим конструктором форм, який ви шукали.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-start gap-3">
            <Button
              asChild
              size="black"
              variant="black"
              className="group font-semibold text-sm px-[22px] h-[42px] bg-[#101828]"
            >
              <Link href="/forms" className="flex gap-3.5">
                <div className="animate-pulse w-2 h-2 bg-[#7CE0C4] rounded-full"></div>
                Створити форму
                {/* <div className="ml-0.5 mt-[1px] p-[4px] bg-white/20 rounded-full -rotate-45">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div> */}
              </Link>
            </Button>
            {/* <Button variant="ghost" size="lg" className="text-muted-foreground">
              Як це працює?
            </Button> */}
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-up-delay-3 mt-6 flex flex-wrap items-center gap-5 text-sm text-[#1C1C1C]/80">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Безкоштовний старт</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>5 хвилин на створення</span>
            </div>
            {/* <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Instagram Telegram</span>
            </div> */}
          </div>
        </div>

        {/* Preview card */}
        <div className="mt-16 relative w-full max-w-3xl mx-auto">
          <div className="relative bg-background rounded-2xl shadow-elevated border border-border/60 p-5 md:p-6">
            <div className="grid md:grid-cols-2 gap-10">
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
                <div className="text-[10px] font-semibold text-[#2BB58F] uppercase tracking-widest mb-3">Після</div>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#2BB58F]" />
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

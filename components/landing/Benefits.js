// components/landing/Benefits

import { MessageSquareOff, Eye, Timer, ListChecks, Brain, Wifi } from "lucide-react";

const benefits = [
  {
    icon: MessageSquareOff,
    title: "Менше повідомлень",
    description: "Більше не треба відповідати на «скільки коштує?» — все є у формі.",
  },
  {
    icon: Eye,
    title: "Більше ясності",
    description: "Бачиш усі замовлення в одному місці. Нічого не губиться.",
  },
  {
    icon: Timer,
    title: "Економія часу",
    description: "Замість 10 повідомлень — одна форма. Замість години — 5 хвилин.",
  },
  {
    icon: ListChecks,
    title: "Контроль над замовленнями",
    description: "Знаєш, хто що замовив, коли і куди доставити.",
  },
  {
    icon: Brain,
    title: "Спокій у голові",
    description: "Не треба тримати все в памʼяті. Система памʼятає за тебе.",
  },
  {
    icon: Wifi,
    title: "Бізнес працює офлайн",
    description: "Клієнти заповнюють форму, навіть коли ти спиш або відпочиваєш.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Що ти отримуєш
          </h2>
          <p className="text-lg text-muted-foreground">
            Не функції, а відчуття. Не фічі, а результат.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group text-center p-8 rounded-2xl gradient-card border border-border/50 hover:shadow-soft transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-105 transition-transform">
                <benefit.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

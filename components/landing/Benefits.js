// components/landing/Benefits

import {
  MessageSquareOff,
  Eye,
  Timer,
  ListChecks,
  Brain,
  Wifi,
} from "lucide-react";

const benefits = [
  {
    icon: MessageSquareOff,
    title: "Менше переписок",
    description: "Основні питання закриваються формою, а не повідомленнями.",
  },
  {
    icon: Eye,
    title: "Однакові заявки",
    description: "Кожне замовлення має ту саму структуру і поля.",
  },
  {
    icon: Timer,
    title: "Швидше прийом замовлень",
    description: "Одна форма замість серії уточнень у чаті.",
  },
  {
    icon: ListChecks,
    title: "Менше помилок",
    description: "Дані не губляться і не плутаються між повідомленнями.",
  },
  {
    icon: Brain,
    title: "Менше навантаження",
    description: "Не потрібно тримати деталі в памʼяті або нотатках.",
  },
  {
    icon: Wifi,
    title: "Асинхронна робота",
    description: "Заявки приходять без постійної присутності в чаті.",
  },
]

const BenefitsSection = () => {
  return (
    <section id="pain" className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Що дає форма замість чатів
          </h2>
          <p className="text-lg text-muted-foreground">
            Коротко про результат для процесу, без маркетингу.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-soft transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection

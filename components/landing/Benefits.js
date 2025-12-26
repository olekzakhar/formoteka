// components/landing/Benefits

import { MessageSquareOff, Eye, Clock, ListChecks, Brain, Wifi } from "lucide-react";

const benefits = [
  {
    icon: MessageSquareOff,
    title: "Менше повідомлень",
    description: "Клієнти заповнюють форму, а не пишуть вам. Ви отримуєте готове замовлення.",
  },
  {
    icon: Eye,
    title: "Більше ясності",
    description: "Всі деталі замовлення — розмір, колір, адреса — одразу перед очима.",
  },
  {
    icon: Clock,
    title: "Економія часу",
    description: "Замість години переписок — 2 хвилини на обробку готової заявки.",
  },
  {
    icon: ListChecks,
    title: "Контроль над замовленнями",
    description: "Бачите все: що замовили, коли, кому потрібно відправити.",
  },
  {
    icon: Brain,
    title: "Спокій у голові",
    description: "Ввечері ви точно знаєте: нічого не загубилось, всіх опрацювали.",
  },
  {
    icon: Wifi,
    title: "Бізнес працює офлайн",
    description: "Форма приймає замовлення, поки ви зайняті іншими справами.",
  },
];

const Benefits = () => {
  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Що ви отримуєте
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Не функції — а відчуття і результат
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group text-center p-8 rounded-2xl bg-background hover:shadow-card transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
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

export default Benefits;

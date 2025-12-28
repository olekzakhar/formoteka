// components/landing/PainPoints

import { MessageSquare, Clock, HelpCircle, Search, AlertTriangle, Moon } from "lucide-react";

const painPoints = [
  {
    icon: MessageSquare,
    emoji: "💬",
    title: "«Напишіть у директ»",
    description: "І потім годинами перекидаєтесь повідомленнями замість того, щоб просто отримати замовлення",
  },
  {
    icon: Clock,
    emoji: "🌙",
    title: "Повідомлення о 23:40",
    description: "«А ще є в наявності?» І ви відповідаєте, бо боїтесь втратити клієнта",
  },
  {
    icon: Search,
    emoji: "📱",
    title: "Скріни замість замовлень",
    description: "Клієнт надсилає фото товару, а ви потім шукаєте що це і скільки коштує",
  },
  {
    icon: HelpCircle,
    emoji: "🔄",
    title: "«А можна ще раз адресу?»",
    description: "Одні й ті самі питання по 10 разів на день. Розмір? Колір? Куди доставка?",
  },
  {
    icon: AlertTriangle,
    emoji: "😵",
    title: "Плутанина з деталями",
    description: "Хто замовив синю сукню, а хто чорну? Кому на Нову пошту, кому Укрпоштою?",
  },
  {
    icon: Moon,
    emoji: "😰",
    title: "Ввечері — тривога",
    description: "Здається, щось забули. Когось не відписали. Якесь замовлення загубилось",
  },
];

const PainPoints = () => {
  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Знайома ситуація?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Якщо впізнали себе хоча б в одному пункті — ви не самі. 
            Так працює більшість малого бізнесу в Україні.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{point.emoji}</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {point.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;

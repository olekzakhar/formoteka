// components/landing/Comparison

import { ArrowRight, X, Check } from "lucide-react";

const comparisons = [
  {
    before: "Переписка на 20 повідомлень",
    after: "Готова заявка за 2 хвилини",
  },
  {
    before: "«А можна ще раз адресу?»",
    after: "Всі деталі вже у формі",
  },
  {
    before: "Клієнт зник після «подумаю»",
    after: "Замовлення зафіксоване одразу",
  },
  {
    before: "Записи в блокноті та нотатках",
    after: "Усе в одному місці",
  },
  {
    before: "Відповідаєш на одне й те саме",
    after: "Форма відповідає за тебе",
  },
  {
    before: "Хаос у голові ввечері",
    after: "Спокій і контроль",
  },
];

const ComparisonSection = () => {
  return (
    <section className="py-20 md:py-28 gradient-warm">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Що змінюється з Formoteka
          </h2>
          <p className="text-lg text-muted-foreground">
            Від хаосу до порядку — крок за кроком.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {comparisons.map((item, index) => (
            <div 
              key={index}
              className="group flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 md:p-6 rounded-2xl bg-card border border-border/50 hover:shadow-soft transition-all duration-300"
            >
              {/* Before */}
              <div className="flex-1 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                <span className="text-muted-foreground line-through decoration-destructive/30">
                  {item.before}
                </span>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center px-4">
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>

              {/* After */}
              <div className="flex-1 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground font-medium">
                  {item.after}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;

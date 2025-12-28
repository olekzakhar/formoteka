// components/landing/BeforeAfter

import { ArrowRight, X, Check } from "lucide-react";

const comparisons = [
  {
    before: "Нескінченні переписки",
    after: "Готові заявки з усіма деталями",
  },
  {
    before: "«А який розмір? А колір?»",
    after: "Клієнт сам все заповнює у формі",
  },
  {
    before: "Замовлення губляться",
    after: "Все в одному місці",
  },
  {
    before: "Клієнти зникають",
    after: "Чітке замовлення одразу",
  },
  {
    before: "Відповідаєте 24/7",
    after: "Форма працює за вас",
  },
  {
    before: "Хаос у голові",
    after: "Спокій і контроль",
  },
];

const BeforeAfter = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Що змінюється з{" "}
            <span className="text-gradient-primary">Formoteka</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Проста зміна, яка економить години щодня
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {comparisons.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0"
              >
                {/* Before */}
                <div className="flex-1 flex items-center gap-3 p-4 sm:p-5 rounded-xl sm:rounded-l-xl sm:rounded-r-none bg-destructive/5 border border-destructive/20">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="text-foreground/80">{item.before}</span>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex items-center justify-center w-12 bg-muted">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>

                {/* After */}
                <div className="flex-1 flex items-center gap-3 p-4 sm:p-5 rounded-xl sm:rounded-r-xl sm:rounded-l-none bg-primary/5 border border-primary/20">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;

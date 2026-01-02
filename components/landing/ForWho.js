// components/landing/ForWho

import { Check } from "lucide-react";

const scenarios = [
  {
    title: "Якщо ти продаєш через Instagram",
    description: "І втомився від «напишіть у директ» — форма збере замовлення автоматично.",
  },
  {
    title: "Якщо клієнти постійно питають одне й те саме",
    description: "«Скільки коштує?», «Яка доставка?» — нехай форма відповідає замість тебе.",
  },
  {
    title: "Якщо ти сам відповідаєш на всі повідомлення",
    description: "І мрієш про помічника — Formoteka стане твоїм безкоштовним асистентом.",
  },
  {
    title: "Якщо хочеш виглядати професійніше",
    description: "Без сайту, без складних налаштувань — просто красива форма замовлення.",
  },
  {
    title: "Якщо ти майстер, консультант чи тренер",
    description: "І записуєш клієнтів вручну — форма запису все зробить за тебе.",
  },
  {
    title: "Якщо ти продаєш у TikTok чи Telegram",
    description: "Один лінк на форму — і клієнти самі заповнюють усе, що треба.",
  },
];

const ForWhoSection = () => {
  return (
    <section id="for-who" className="py-20 md:py-28 gradient-warm">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Кому підійде Formoteka
          </h2>
          <p className="text-lg text-muted-foreground">
            Впізнай себе в одному з цих сценаріїв.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {scenarios.map((scenario, index) => (
            <div 
              key={index}
              className="group flex gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/30 hover:shadow-soft transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                <Check className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {scenario.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {scenario.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhoSection;

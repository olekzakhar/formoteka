// components/landing/WhoIsItFor

import { Check } from "lucide-react";

const scenarios = [
  {
    emoji: "📸",
    text: "Ви продаєте через Instagram або TikTok",
  },
  {
    emoji: "💬",
    text: "Клієнти постійно питають одне й те саме",
  },
  {
    emoji: "📱",
    text: "Ви самі відповідаєте на всі повідомлення",
  },
  {
    emoji: "🏠",
    text: "Працюєте з дому або в невеликій команді",
  },
  {
    emoji: "🌐",
    text: "Хочете виглядати професійніше без сайту",
  },
  {
    emoji: "⏰",
    text: "Втомились витрачати час на переписки",
  },
];

const WhoIsItFor = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Formoteka підійде вам, якщо...
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              >
                <span className="text-2xl">{scenario.emoji}</span>
                <span className="text-lg">{scenario.text}</span>
                <Check className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-xl font-medium mb-2">
              Майстри, бʼюті-спеціалісти, консультанти, продавці, кондитери, 
              флористи, ремонтники, репетитори...
            </p>
            <p className="text-muted-foreground">
              Якщо ви приймаєте замовлення через повідомлення — Formoteka для вас.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;

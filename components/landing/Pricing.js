// components/landing/Pricing

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Rocket } from "lucide-react";

const plans = [
  {
    name: "Безкоштовно",
    price: "0",
    period: "назавжди",
    description: "Для початку роботи",
    features: [
      "Безкінечна кількість форм",
      "Безкінечна кількість заявок",
      "Базові поля форми"
    ],
    cta: "Почати безкоштовно",
    popular: false,
  },
  {
    name: "Про",
    price: "99",
    originalPrice: "199",
    savingsPercent: "50%",
    period: "на місяць",
    description: "Для професіоналів",
    features: [
      "Все з безкоштовного тарифу",
      "Видалення брендингу Formoteka",
      "Унікальне посилання на форму",
      "Надсилання заявок на email",
      "Email-повідомлення клієнтам",
      "Пріоритетна підтримка",
    ],
    cta: "Спробувати Про",
    popular: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 pt-16 md:pt-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-black font-bold text-foreground mb-4">
            Прості та чесні ціни
          </h2>
          <p className="text-lg text-[#1C1C1C]">
            Почніть безкоштовно. Переходьте на Про коли будете готові
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                relative p-8 flex flex-col rounded-2xl border transition-all duration-300
                ${plan.popular 
                  ? 'bg-white/70 border-primary/40! shadow-soft hover:shadow-elevated' 
                  : 'bg-white/50 border-white/40! hover:shadow-soft'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#7CE0C4] text-black/[0.58] text-xs font-semibold border-[1.5px] border-black/[0.04]!">
                  Знижка {plan.savingsPercent}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-black mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#1C1C1C]/80 mb-4">
                  {plan.description}
                </p>
                
                {/* HORIZONTAL PRICE LAYOUT - OLD LEFT, NEW RIGHT */}
                <div className="flex items-center justify-center gap-3">
                  {plan.originalPrice && (
                    <span className="text-xl text-[#1C1C1C]/40 line-through">
                      {plan.originalPrice} грн
                    </span>
                  )}
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-black">
                      {plan.price}
                    </span>
                    <span className="text-lg text-[#1C1C1C]/80">грн</span>
                  </div>
                </div>
                
                <p className="text-sm text-[#1C1C1C]/60 mt-2">
                  {plan.period}
                </p>
              </div>

              <ul className="space-y-3 mb-8 mx-auto w-full max-w-[94%]">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#2BB58F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#2BB58F]" />
                    </div>
                    <span className="text-sm text-[#1C1C1C]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="black"
                variant={plan.popular ? "black" : "secondary"}
                className={`
                  mt-auto w-full font-semibold text-sm h-[42px]
                  ${plan.popular 
                    ? 'bg-black hover:bg-black/80' 
                    : 'bg-white/60 hover:bg-white/80 border border-black/10'
                  }
                `}
              >
                <Link href="/forms" className={plan.popular ? "flex items-center justify-center gap-2" : ""}>
                  {plan.popular && <Rocket className="w-4 h-4" />}
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#1C1C1C]/60 mt-8">
          Усі тарифи включають безпечне зберігання даних та регулярні оновлення
        </p>
      </div>
    </section>
  )
}

export default PricingSection

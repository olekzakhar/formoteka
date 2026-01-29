// components/landing/Comparison

import { cn } from "@/utils";
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
    after: "Заявка зафіксована одразу",
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
    <section className="py-20 md:py-28 pt-16 md:pt-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-black font-bold text-foreground mb-4">
            Що змінюється з Formoteka
          </h2>
          <p className="text-lg text-[#1C1C1C]">
            Проста зміна, яка економить години щодня
          </p>
        </div>

        <div className="max-w-[860px] mx-auto grid md:grid-cols-2 gap-6">
          {/* Before Block */}
          <div className="bg-red-400/25 h-fit rounded-3xl border border-black/[0.1]! overflow-hidden">
            <div className="pt-7 pb-1">
              <h3 className="px-8 text-xl font-bold mb-5 flex items-center gap-2">
                <X className="w-5 h-5" /> Без Formoteka
              </h3>
              <div className="space-y-3.5">
                {comparisons.map((item, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      'pb-3.5',
                      index !== comparisons.length - 1 ? 'border-b border-black/[0.1]!' : '',
                      index === 0 ? 'pt-3.5 border-t border-black/[0.14]!' : ''
                    )}
                  >
                    <p className="flex items-center pl-[34px] pr-8 font-medium">
                      <X className="mr-2 w-4 h-4" />
                      {item.before}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* After Block */}
          <div className="bg-[#2BB58F]/25 h-fit rounded-3xl border border-black/[0.1]! overflow-hidden">
            <div className="pt-7 pb-1">
              <h3 className="px-8 text-xl font-bold mb-5 flex items-center gap-2">
                <Check className="w-5 h-5" /> Formoteka
              </h3>
              <div className="space-y-3.5">
                {comparisons.map((item, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      'pb-3.5',
                      index !== comparisons.length - 1 ? 'border-b border-black/[0.1]!' : '',
                      index === 0 ? 'pt-3.5 border-t border-black/[0.14]!' : ''
                    )}
                  >
                    <p className="flex items-center pl-[34px] pr-8 font-medium">
                      <Check className="mr-2 w-4 h-4" />
                      {item.after}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComparisonSection

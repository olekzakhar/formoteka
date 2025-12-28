// components/landing/FAQ

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Чи потрібен мені сайт, щоб користуватись Formoteka?",
    answer: "Ні, сайт не потрібен. Formoteka створює просту сторінку з вашою формою замовлення, яку ви можете надсилати клієнтам у будь-який месенджер або додавати в профіль Instagram.",
  },
  {
    question: "Чи підійде для Instagram?",
    answer: "Так, ідеально підійде! Ви додаєте посилання на форму в bio або надсилаєте в директ. Клієнти переходять, заповнюють — і ви отримуєте готове замовлення замість переписки.",
  },
  {
    question: "Це складно налаштувати?",
    answer: "Ні, дуже просто. Ви обираєте, які дані вам потрібні від клієнта (імʼя, телефон, адреса, розмір тощо), і форма готова. Без технічних знань, без коду.",
  },
  {
    question: "Скільки часу займає створення форми?",
    answer: "5-10 хвилин. Обираєте поля, додаєте опис товарів чи послуг — і все. Можете почати отримувати замовлення вже сьогодні.",
  },
  {
    question: "Чи підійде для малого бізнесу?",
    answer: "Formoteka створена саме для малого бізнесу. Для тих, хто продає через соцмережі, працює сам або з невеликою командою. Без складних функцій — тільки те, що потрібно.",
  },
  {
    question: "Чи можна спробувати безкоштовно?",
    answer: "Так, ви можете створити першу форму і отримувати замовлення безкоштовно. Платні функції знадобляться, коли захочете більше можливостей.",
  },
  {
    question: "А якщо я щось не зрозумію?",
    answer: "Напишіть нам — допоможемо. Ми самі підприємці і знаємо, як важливо отримати швидку відповідь.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Часті питання
          </h2>
          <p className="text-xl text-muted-foreground">
            Відповіді на те, що найчастіше запитують
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background rounded-xl border border-border px-6 data-[state=open]:shadow-soft transition-all duration-300"
            >
              <AccordionTrigger className="text-left text-lg font-semibold py-5 hover:no-underline hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;

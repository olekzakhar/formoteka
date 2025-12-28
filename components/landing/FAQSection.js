import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Чи потрібен сайт?",
    answer: "Ні, сайт не потрібен. Formoteka — це окремий сервіс, який дає тобі посилання на форму. Просто поділись цим посиланням у своєму Instagram, Telegram чи де завгодно.",
  },
  {
    question: "Чи підійде для Instagram?",
    answer: "Ідеально підійде! Замість «напишіть у директ» — даєш посилання на форму. Клієнти заповнюють — ти отримуєш готові замовлення.",
  },
  {
    question: "Це складно налаштувати?",
    answer: "Зовсім ні. Створення форми займає буквально 5 хвилин. Просто обираєш, які поля тобі потрібні — і все готово. Жодного програмування.",
  },
  {
    question: "Скільки часу займає створення форми?",
    answer: "5-10 хвилин. Серйозно. Обираєш поля (імʼя, телефон, товар, адреса) — і форма готова до роботи.",
  },
  {
    question: "Чи підійде для малого бізнесу?",
    answer: "Formoteka створена саме для малого бізнесу. Для тих, хто продає в Instagram, приймає замовлення в месенджерах, працює сам або з невеликою командою.",
  },
  {
    question: "Чи можна спробувати безкоштовно?",
    answer: "Так, є безкоштовний тариф. Можеш створити форму і подивитись, як це працює — без жодних зобовʼязань.",
  },
  {
    question: "Як клієнти будуть заповнювати форму?",
    answer: "Ти отримаєш унікальне посилання на свою форму. Поділишся ним у сторіз, біо, постах чи месенджерах — і клієнти заповнюють форму прямо з телефону.",
  },
  {
    question: "Куди приходять замовлення?",
    answer: "Усі замовлення зберігаються в твоєму особистому кабінеті Formoteka. Також можеш налаштувати сповіщення на email чи в Telegram.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Питання та відповіді
          </h2>
          <p className="text-lg text-muted-foreground">
            Найпоширеніші питання про Formoteka.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-2xl px-6 data-[state=open]:shadow-soft transition-shadow"
              >
                <AccordionTrigger className="text-left text-foreground font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

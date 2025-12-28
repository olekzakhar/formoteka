import { MessageCircle, Clock, HelpCircle, AlertTriangle, Moon, Inbox } from "lucide-react";

const painPoints = [
  {
    icon: MessageCircle,
    title: "«Напишіть у директ»",
    description: "І починається: директ, коментарі, Telegram, Viber. Клієнти скрізь, а ти — розриваєшся.",
  },
  {
    icon: Clock,
    title: "Повідомлення о 23:40",
    description: "«Добрий вечір, а ви ще працюєте?» Бізнес не має вихідних, але ти маєш право на відпочинок.",
  },
  {
    icon: Inbox,
    title: "Скріни замість замовлень",
    description: "«Ось скрін, там все написано». Тепер шукай серед 50 фото, що саме хотів клієнт.",
  },
  {
    icon: HelpCircle,
    title: "Одні й ті самі питання",
    description: "«А скільки коштує доставка?» — вдесяте за день. Відповідаєш, відповідаєш, відповідаєш...",
  },
  {
    icon: AlertTriangle,
    title: "Плутанина з деталями",
    description: "Хто замовив синю, а хто зелену? Яка адреса? Куди телефонувати? Де те повідомлення?!",
  },
  {
    icon: Moon,
    title: "Ввечері немає спокою",
    description: "Лягаєш спати з думкою: «Здається, я щось забув». Бо все в голові, а не в системі.",
  },
];

const PainSection = () => {
  return (
    <section id="pain" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Знайома ситуація?
          </h2>
          <p className="text-lg text-muted-foreground">
            Якщо хоча б одне з цього — про тебе, значить час щось змінити.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {painPoints.map((point, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-soft transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <point.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {point.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainSection;

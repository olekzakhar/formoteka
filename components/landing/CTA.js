import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 gradient-subtle relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] bg-primary/3 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Готовий навести порядок
            <br />
            <span className="text-gradient">у своїх замовленнях?</span>
          </h2>

          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Створи форму за 5 хвилин. Безкоштовно. Без складних налаштувань.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="group font-semibold px-6">
              Створити форму
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button variant="ghost" size="lg" className="text-muted-foreground">
              Дізнатись більше
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Без картки • Без зобовʼязань
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

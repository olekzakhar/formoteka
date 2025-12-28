// components/landing/FinalCTA

import { Button } from "@/components/ui/button-2";
import { ArrowRight, Sparkles } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-narrow relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-light text-accent text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Почніть безкоштовно
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Готові навести порядок у замовленнях?
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Створіть першу форму за 5 хвилин. Без реєстрації, без оплати, 
            без технічних складнощів. Просто спробуйте.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl">
              Створити форму замовлення
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Безкоштовно • Без картки • Займає 5 хвилин
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

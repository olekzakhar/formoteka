// components/landing/CTA

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 gradient-subtle relative overflow-hidden">
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

          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row justify-center items-start gap-3">
            <Button
              asChild
              size="black"
              variant="black"
              className="group font-semibold text-sm px-[22px] h-[42px]"
            >
              <Link href="/forms" className="flex gap-3.5">
                <div className="animate-pulse w-2 h-2 bg-[#7CE0C4] rounded-full"></div>
                Створити форму
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Без картки • Без зобовʼязань
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTASection

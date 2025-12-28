// components/landing/Hero

import Image from "next/image";
import { Button } from "@/components/ui/button-2";
import { ArrowRight, MessageCircle, Clock, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background decoration */}
      {/* <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" /> */}
      
      {/* <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style> */}

      <div className="absolute top-0 right-0 w-[44vw] h-[100vh] bg-gray-400 overflow-hidden">
        <Image
          src="/hero-2.jpg"
          alt="Hero image"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container-wide mr-[47vw]! relative z-10 py-20 pt-[110px]">        
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009E99]/[0.1] text-primary text-sm font-medium uppercase border border-[#009E99]/60! mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Zap className="w-4 h-4" />
            Для малого бізнесу
          </div>

          {/* Main headline */}
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Замовлення в директі,
            <span className="block text-[#009E99]">хаос у голові?</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-10 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Formoteka перетворює переписки на чіткі заявки. Клієнт заповнює форму — ти отримуєш готове замовлення.
          </p>

          {/* CTAs */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button variant="hero" size="xl">
              Навести порядок у замовленнях
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-outline" size="lg">
              Подивитись, як це працює
            </Button>
          </div>

          {/* Social proof hints */}
          <div 
            className="flex flex-wrap justify-center gap-6 text-muted-foreground text-sm opacity-0 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Менше повідомлень</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Більше часу</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Створюється за 5 хвилин</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

// components/landing/Templates

'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const templates = [
  {
    title: "Під замовлення",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-3_640.webp",
    href: "/forms",
  },
  {
    title: "Продаж товарів",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-1_640.webp",
    href: "/forms",
  },
  {
    title: "Події",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-7_640.webp",
    href: "/forms",
  },
  {
    title: "Доставка їжі",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-3_640.webp",
    href: "/forms",
  },
  {
    title: "Запис до майстра",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-4_640.webp",
    href: "/forms",
  },
  {
    title: "Опитування",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-2_640.webp",
    href: "/forms",
  },
];

const Templates = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 414; // 390px ширина + 24px gap
      const newPosition = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="templates" className="my-20">
      <div className="mx-auto pt-[160px] md:pt-[160px] pb-[125px] md:pb-[125px] w-[93.4%] max-w-[1500px] rounded-[14px] bg-[#111110]">
        <h2 className="text-4xl md:text-5xl font-medium text-[#F0F0EB] text-center mb-4 leading-[48px]">
          Готові шаблони<br />для вашого бізнесу
        </h2>

        {/* Horizontal scrollable container */}
        <div className="relative overflow-visible">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pl-[70px] pr-[24px] py-8"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {templates.map((template, index) => (
              <Link
                key={index}
                href={template.href}
                className="flex-shrink-0 w-[390px] bg-[#f0f0eb]/[0.05] rounded-2xl pb-4 px-4 pt-0 transition-all duration-300 hover:scale-105 block"
              >
                {/* Title */}
                <h3 className="px-7 my-8 text-xl font-medium text-[#f0f0eb99] leading-[20px]">
                  {template.title}
                </h3>

                {/* Image */}
                <div className="rounded-[5px] overflow-hidden">
                  <img
                    src={template.imageUrl}
                    alt={template.title}
                    className="w-full h-auto min-h-[540px] max-h-[600px] object-cover object-top"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="absolute -bottom-[26px] right-[33px] flex justify-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Попередні шаблони"
            >
              <ChevronLeft className="w-5 h-5 text-[#F0F0EB]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Наступні шаблони"
            >
              <ChevronRight className="w-5 h-5 text-[#F0F0EB]" />
            </button>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            asChild
            className="rounded-full bg-white/95 text-black hover:bg-white/85 font-semibold text-sm px-10 py-5.5 h-auto"
          >
            <Link href="/forms">
              Більше шаблонів
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default Templates

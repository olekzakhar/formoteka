// components/landing/Templates

import Link from "next/link";
import { Button } from "@/components/ui/button";

const templates = [
  {
    title: "Під замовлення",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-3_640.webp",
  },
  // {
  //   title: "Доставка їжі",
  //   imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=280&fit=crop",
  // },
  {
    title: "Продаж товарів",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-1_640.webp",
  },
  // {
  //   title: "Запис до майстра",
  //   imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=280&fit=crop",
  // },
  {
    title: "Події",
    imageUrl: "https://flodesk.com/_next/static/chunks/images/assets/home/cta/cta-7_640.webp",
  },
  // {
  //   title: "Опитування",
  //   imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=280&fit=crop",
  // },
];

const Templates = () => {
  return (
    <section id="templates" className="my-20">
      <div className="mx-auto px-6 md:px-10 pt-[160px] md:pt-[160px] pb-[125px] md:pb-[125px] w-[93.4%] max-w-[1500px] rounded-[14px] bg-[#111110]">
        <h2 className="text-4xl md:text-5xl font-medium text-[#F0F0EB] text-center mb-12 leading-[48px]">
          Готові шаблони<br />для вашого бізнесу
        </h2>

        {/* Grid of template cards */}
        <div className="max-w-[1360px] mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <div
              key={index}
              className="bg-[#f0f0eb]/[0.05] rounded-2xl pb-4 px-4 pt-0 transition-colors"
            >
              {/* Title */}
              <h3 className="px-9 my-10 text-2xl font-medium text-[#f0f0eb99] leading-[24px]">
                {template.title}
              </h3>

              {/* Image instead of description text */}
              <div className="rounded-[5px] overflow-hidden">
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  className="w-full h-auto min-h-[540px] max-h-[600px] object-cover object-top"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            asChild
            className="mt-24 rounded-full bg-white/95 text-black hover:bg-white/85 font-semibold text-sm px-10 py-5.5 h-auto"
          >
            <Link href="/forms">
              Більше шаблонів
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Templates

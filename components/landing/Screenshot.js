// components/landing/ScreenshotSection

import Image from "next/image";
import screenshot from '@/public/landing/screenshot.jpg'

export default function ScreenshotSection() {
  return (
    <section className="relative mx-auto px-8 w-full max-w-[1290px] h-[100vh] max-h-[630px] overflow-hidden shadow-elevated animate-fade-up rounded-2xl">
      {/* Зображення */}
      <Image
        src={screenshot}
        alt="Formoteka"
        fill
        className="object-cover [object-position:left_top] rounded-2xl opacity-[0.96] hover:opacity-100 transition-opacity duration-250 ease-in-out"
      />
    </section>
  )
}








// 'use client'

// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

// import Image from "next/image";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import screenshot from '@/public/landing/screenshot.jpg'

// export default function ScreenshotSection() {
//   return (
//     <section className="relative mx-auto px-8 w-full max-w-[1290px] h-[100vh] max-h-[630px] overflow-hidden shadow-elevated animate-fade-up group cursor-pointer rounded-2xl">
//       {/* Зображення */}
//       <Image
//         src={screenshot}
//         alt="Preview"
//         fill
//         className="object-cover [object-position:left_top] rounded-2xl opacity-[0.99] transition-all duration-500 group-hover:blur-xs group-hover:scale-[1.02]"
//       />
      
//       {/* Оверлей з затемненням */}
//       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 rounded-2xl flex items-center justify-center">
//         {/* Кнопка */}
//         <Button
//           asChild
//           size="black"
//           variant="black"
//           className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 group/btn font-semibold text-sm px-[22px] h-[42px] bg-black hover:bg-black/80 shadow-xl"
//         >
//           <Link href="/forms" className="flex items-center gap-2">
//             Спробувати
//             <div className="ml-0.5 p-[4px] bg-white/20 rounded-full -rotate-45">
//               <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
//             </div>
//           </Link>
//         </Button>
//       </div>
//     </section>
//   )
// }





// "use client";

// import Image from "next/image";
// import screenshot from '@/public/landing/screenshot.jpg'

// export default function ScreenshotSection() {
//   return (
//     <section className="relative overflow-hidden">
//       <div className="">
//         <div className="p-3 md:p-5">
//           {/* CLIP WINDOW */}
//           <div
//             className={[
//               "shotWindow",
//               "relative overflow-hidden",
//               // висота не повинна бути > 900px
//               "h-[260px] sm:h-[320px] md:h-[420px] lg:h-[540px] xl:h-[620px]",
//             ].join(" ")}
//           >
//             {/* Perspective */}
//             <div className="absolute inset-0 [perspective:1200px]">
//               {/* Animated layer (рамка видно одразу, ця група заїжджає зверху) */}
//               <div className="shotIn absolute inset-0">
//                 {/* ROTATED GROUP (І зображення, І обводка повернуті ОДНАКОВО) */}
//                 <div className="shotGroup absolute left-0 -top-[60px] opacity-90">
//                   {/* Border/frame that rotates with image */}
//                   <div className="absolute inset-0 rounded-3xl border border-black/30 pointer-events-none" />

//                   {/* Gap between border and image */}
//                   <div className="absolute inset-0 px-3 py-2">
//                     <div className="relative w-full h-full overflow-hidden rounded-2xl">
//                       <Image
//                         src={screenshot}
//                         alt="Preview"
//                         fill
//                         priority
//                         className="object-cover [object-position:left_top]"
//                         sizes="(max-width: 768px) 92vw, 1200px"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <style jsx>{`
//               /* Фон для градієнтів (твій var) */
//               .shotWindow {
//                 background: var(--color-bg-primary);
//               }

//               /* Градієнти, щоб “ховали” обрізане справа і знизу */
//               .shotWindow::after {
//                 content: "";
//                 position: absolute;
//                 inset: 0;
//                 pointer-events: none;
//                 z-index: 30;
//                 background:
//                   linear-gradient(
//                     to right,
//                     transparent 78%,
//                     var(--color-bg-primary) 92%
//                   ),
//                   linear-gradient(
//                     to bottom,
//                     transparent 70%,
//                     var(--color-bg-primary) 92%
//                   );
//               }

//               /* Анімація: заїзд зверху */
//               .shotIn {
//                 transform: translateY(-14%);
//                 opacity: 0;
//                 animation: shotIn 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 120ms
//                   forwards;
//                 will-change: transform, opacity;
//               }

//               @keyframes shotIn {
//                 to {
//                   transform: translateY(0);
//                   opacity: 1;
//                 }
//               }

//               /*
//                 ВАЖЛИВО ПО ТВОЇХ УМОВАХ:
//                 - “розвернуте по зображення з обводкою” має ширину 1935px
//                 - висота > 900px, щоб обрізалось
//                 - не обрізаємо зліва/зверху: даємо translateX/Y ТІЛЬКИ в плюс
//                 - бордер повертається разом із зображенням (бо це одна група)
//               */
//               .shotGroup {
//                 width: 1935px;
//                 height: 1100px; /* > 900, щоб було що обрізати знизу */
//                 transform-origin: top left;

//                 /*
//                   Робимо так, щоб воно було видно на екрані:
//                   - базовий твій scale(1.2)
//                   - плюс адаптивний множник --shotScale (щоб не ставало “гігантським”)
//                   - translateX/Y тільки вправо/вниз, щоб верх/ліво не вилізали за clip
//                 */
//                 transform: translate3d(var(--shotTx), var(--shotTy), 0)
//                   scale(calc(1.1 * var(--shotScale))) rotateX(47deg)
//                   rotateY(36deg) rotate(324deg);
//               }

//               /* Дефолтні значення для трансформів */
//               .shotWindow {
//                 --shotScale: 0.52; /* щоб одразу було видно, не “зникало” */
//                 --shotTx: 46px; /* тільки вправо */
//                 --shotTy: 48px; /* тільки вниз */
//               }

//               /* Трохи більшим на ширших екранах */
//               @media (min-width: 640px) {
//                 .shotWindow {
//                   --shotScale: 0.6;
//                   --shotTx: 54px;
//                   --shotTy: 52px;
//                 }
//               }
//               @media (min-width: 768px) {
//                 .shotWindow {
//                   --shotScale: 0.72;
//                   --shotTx: 62px;
//                   --shotTy: 58px;
//                 }
//               }
//               @media (min-width: 1024px) {
//                 .shotWindow {
//                   --shotScale: 0.86;
//                   --shotTx: 70px;
//                   --shotTy: 64px;
//                 }
//               }
//               @media (min-width: 1280px) {
//                 .shotWindow {
//                   --shotScale: 0.6;
//                   --shotTx: 0px;
//                   --shotTy: 134px;
//                 }
//               }
//             `}</style>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// Це версія де хедер просто не зникає

// // components/landing/Header

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { BASE_URL } from "@/constants";
// import Logo from "@/components/Logo";

// const Header = ({ isUser=false }) => {
//   return (
//     <header className="fixed top-0 left-1/2 px-3 pt-1.5 pb-2 -translate-x-1/2 w-full border-b border-b-black/[0.06]!
//       rounded-b-3xl backdrop-blur-lg z-50">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-12">
//           <Link
//             href={BASE_URL}
//             className="ml-1.5 flex items-center gap-2 group text-[#14171F]"
//           >
//             <Logo />
//           </Link>
          
//           <nav className="pt-[5px] hidden md:flex items-center gap-5 text-sm font-medium text-[#1C1C1C]/80 transition-colors duration-200 ease-in-out">
//             <Link href="#pricing" className="hover:text-[#101828]">
//               Ціни
//             </Link>
//             <Link href="#templates" className="hover:text-[#101828]">
//               Шаблони
//             </Link>
//             <Link href="#faq" className="hover:text-[#101828]">
//               FAQ
//             </Link>
//           </nav>
//         </div>

//         <Button
//           asChild
//           className="rounded-full h-8 bg-transparent hover:bg-white/20 border-[1.5px] border-black! text-black font-semibold
//             shadow-[2px_2px_0_#000] transition-colors duration-200 ease-in-out"
//           size="sm"
//           variant="secondary"
//         >
//           <Link href="/forms">
//             {isUser ? 'Керувати формами' : 'Увійти'}
//           </Link>
//         </Button>
//       </div>
//     </header>
//   )
// }

// export default Header






'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { BASE_URL } from "@/constants";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";

const Header = ({ isUser = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
        setScrollingDown(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Прокручування вниз
        if (!scrollingDown) {
          setScrollingDown(true);
          setTimeout(() => {
            setIsVisible(false);
          }, 100);
        }
      } else if (currentScrollY < lastScrollY) {
        // Прокручування вгору
        setScrollingDown(false);
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, scrollingDown]);

  return (
    <header
      className={cn(
        'fixed top-0 left-1/2 px-3 pt-1.5 pb-2 w-full border-b border-b-black/[0.06]!',
        'rounded-b-3xl backdrop-blur-lg z-50',
        'transition-transform ease-out',
        isVisible ? 'translate-y-0 -translate-x-1/2 duration-300' : '-translate-y-full -translate-x-1/2 duration-700'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href={BASE_URL}
            className="ml-1.5 flex items-center gap-2 group text-[#14171F]"
          >
            <Logo />
          </Link>

          <nav className="pt-[5px] hidden md:flex items-center gap-5 text-sm font-medium text-[#1C1C1C]/80 transition-colors duration-200 ease-in-out">
            <Link href="#pricing" className="hover:text-[#101828]">
              Ціни
            </Link>
            <Link href="#templates" className="hover:text-[#101828]">
              Шаблони
            </Link>
            <Link href="#faq" className="hover:text-[#101828]">
              FAQ
            </Link>
          </nav>
        </div>

        <Button
          asChild
          className="rounded-full h-8 bg-transparent hover:bg-white/20 border-[1.5px] border-black! text-black font-semibold
            shadow-[2px_2px_0_#000] transition-colors duration-200 ease-in-out"
          size="sm"
          variant="secondary"
        >
          <Link href="/forms">
            {isUser ? 'Керувати формами' : 'Увійти'}
          </Link>
        </Button>
      </div>
    </header>
  )
}

export default Header

// components/landing/Header

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/constants";
import Logo from "@/components/Logo";

const Header = ({ isUser=false }) => {
  return (
    <header className="fixed top-0 left-1/2 px-3 pt-1.5 pb-2 -translate-x-1/2 w-full border-b border-b-black/[0.06]!
      rounded-b-3xl backdrop-blur-lg z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href={BASE_URL}
            className="ml-1.5 flex items-center gap-2 group text-[#14171F]"
          >
            <Logo />
          </Link>
          
          <nav className="pt-[5px] hidden md:flex items-center gap-5 text-sm font-medium text-[#1C1C1C]/80 transition-colors duration-200 ease-in-out">
            <Link href="#pain" className="hover:text-[#101828]">
              Ціни
            </Link>
            <Link href="#benefits" className="hover:text-[#101828]">
              Демо
            </Link>
            <Link href="#benefits" className="hover:text-[#101828]">
              Шаблони
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

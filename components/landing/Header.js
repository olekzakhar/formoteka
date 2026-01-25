// components/landing/Header

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/constants";
import Logo from "@/components/Logo";

const Header = ({ isUser=false }) => {
  return (
    <header className="fixed top-[6px] left-1/2 px-3 pb-2 -translate-x-1/2 w-full border-b border-b-black/[0.05]! rounded-b-3xl z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href={BASE_URL}
            className="ml-1.5 flex items-center gap-2 group text-[#14171F]"
          >
            <Logo />
          </Link>
          
          <nav className="pt-[5px] hidden md:flex items-center gap-5 text-sm font-medium text-[#475467] transition-colors duration-200 ease-in-out">
            <a href="#pain" className="hover:text-[#101828]">
              Ціни
            </a>
            <a href="#benefits" className="hover:text-[#101828]">
              Демо
            </a>
          </nav>
        </div>

        {isUser
          ? <Button
              asChild
              className="rounded-full h-8 bg-transparent border-[1.5px] border-black! text-black font-semibold
                shadow-[2px_2px_0_#000] transition-colors duration-200 ease-in-out"
              size="sm"
              variant="secondary"
            >
              <Link href="/forms">
                Керувати формами
              </Link>
            </Button>
          : <Button
              asChild
              className="rounded-full h-8 bg-black/[0.06] hover:bg-black/[0.08] border border-[#2F3032]/[0.05]! font-medium transition-colors duration-200 ease-in-out"
              size="sm"
              variant="outline"
            >
              <Link href="/forms">
                Увійти
              </Link>
            </Button>
        }
      </div>
    </header>
  )
}

export default Header

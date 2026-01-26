// components/landing/Footer

import Link from "next/link"
import { BASE_URL } from "@/constants"
import Logo from "@/components/Logo"

const Footer = () => {
  return (
    <footer className="py-8 bg-[#1C1C1C] rounded-[44px]">
      <div className="container">
        <div className="relative z-[60] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link href={BASE_URL} className="ml-1.5">
            <Logo height={20} color="rgba(255,255,255,0.7)" />
          </Link>

          <nav className="flex items-center gap-6 text-sm text-white/60">
            <Link href="#pricing" className="hover:text-white transition-colors">Ціни</Link>
            <Link href="#" className="hover:text-white transition-colors">Шаблони</Link>
            <Link
              href={BASE_URL}
              className="px-[13px] py-[7px] rounded-[6px] bg-[#3C3B3B] text-white/80"
            >
              Написати нам
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer

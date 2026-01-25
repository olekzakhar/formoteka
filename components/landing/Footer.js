// components/landing/Footer

import Link from "next/link"
import { BASE_URL } from "@/constants"
import Logo from "@/components/Logo"

const Footer = () => {
  return (
    <footer className="py-8">
      <div className="container">
        <div className="relative z-[60] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link
            href={BASE_URL}
            className="ml-1.5 flex items-center gap-2 group text-[#14171F]"
          >
            <Logo height={20} />
          </Link>

          <nav className="flex items-center gap-6 text-xs">
            <a href="#" className="hover:text-foreground transition-colors">Ціни</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer

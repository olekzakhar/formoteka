import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { FileText } from "lucide-react";
import { BASE_URL } from "@/constants";
import Logo from "@/components/Logo";

const Header = ({ isUser=false }) => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-1/2 rounded-full z-50 bg-black/[0.06] backdrop-blur-lg ring-1 ring-inset ring-black/[0.04]">
      <div className="container px-3.5 flex items-center justify-between h-14">
        {/* <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Formoteka</span>
        </a> */}
        <Link
          href={BASE_URL}
          className="ml-1.5 flex items-center gap-2 group text-[#14171F]"
        >
          <Logo height={24} />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#pain" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Ситуація
          </a>
          <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Переваги
          </a>
          <a href="#for-who" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Кому підійде
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            FAQ
          </a>
        </nav>

        {/* <Button className="rounded-full" size="sm">
          Спробувати
        </Button> */}
        {isUser
          ? <Button className="rounded-full" size="sm">
              <Link href="/forms">
                Керувати формами
              </Link>
            </Button>
          : <Button className="rounded-full" size="sm">
              <Link href="/forms">
                Створити форму
              </Link>
            </Button>
        }
      </div>
    </header>
  );
};

export default Header;

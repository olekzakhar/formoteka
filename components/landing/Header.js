// components/landing/Header

import Link from "next/link";

const Header = ({ isUser=false }) => {

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-1/2 rounded-full z-50 bg-black/[0.07] backdrop-blur-lg ring-1 ring-inset ring-black/[0.06]">
      <div className="px-5 flex items-center justify-between h-[60px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold">Formoteka</span>
        </Link>

        {/* CTA */}
        {/* <Button variant="default" size="sm">
          Спробувати безкоштовно
        </Button> */}
        {isUser
          ? <Link
              href="/forms"
              className="inline-flex items-center justify-center px-5 h-[40px] rounded-full! gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
                bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3">
              Керувати формами
            </Link>
          : <Link
              href="/forms"
              className="inline-flex items-center justify-center px-5 h-[40px] rounded-full! gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
                bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3">
              Створити форму
            </Link>
        }
        
      </div>
    </header>
  );
};

export default Header;

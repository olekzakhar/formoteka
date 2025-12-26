// components/landing/Footer

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background/80">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
              <span className="text-background font-bold">F</span>
            </div>
            <span className="text-lg font-bold text-background">Formoteka</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-background transition-colors">
              Політика конфіденційності
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Умови використання
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Контакти
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm">
            © Formoteka. Зроблено в Україні 🇺🇦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

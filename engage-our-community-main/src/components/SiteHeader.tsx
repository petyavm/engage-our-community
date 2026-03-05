import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";

const navItems = [
  { label: "Инициативи", href: "#initiatives" },
  { label: "Новини", href: "#news" },
  { label: "Дейности", href: "#what-we-do" },
  { label: "Настоятелство", href: "#board" },
  { label: "Документи", href: "#documents" },
  { label: "Дарения", href: "#donate" },
  { label: "Контакти", href: "#footer" },
];

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Лого" className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-heading text-lg font-bold text-foreground">
            УН към 163 ОУ
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#join"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Включи се
          </a>
        </nav>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#join"
              className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Включи се
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;

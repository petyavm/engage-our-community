import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const navItems = [
  { label: "Актуално", href: "/актуално", isRoute: true },
  { label: "Дейности", href: "/#what-we-do", isRoute: false },
  { label: "Настоятелство", href: "/настоятелство", isRoute: true },
  { label: "Документи", href: "/#documents", isRoute: false },
  { label: "Дарения", href: "/#donate", isRoute: false },
  { label: "Контакти", href: "/контакти", isRoute: true },
];

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getHref = (href: string, isRoute: boolean) => {
    if (!isRoute && href.startsWith("/#") && isHome) return href.replace("/#", "#");
    return href;
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Лого" className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-heading text-lg font-bold text-foreground">УН към 163 ОУ</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            item.isRoute ? (
              <Link key={item.label} to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.href.split("?")[0] ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={getHref(item.href, item.isRoute)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {item.label}
              </a>
            )
          ))}
          <Link to="/включи-се" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Станете член
          </Link>
        </nav>

        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link key={item.label} to={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  onClick={() => setMenuOpen(false)}>{item.label}</Link>
              ) : (
                <a key={item.label} href={getHref(item.href, item.isRoute)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  onClick={() => setMenuOpen(false)}>{item.label}</a>
              )
            ))}
            <Link to="/включи-се"
              className="mt-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
              onClick={() => setMenuOpen(false)}>
              Станете член
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;

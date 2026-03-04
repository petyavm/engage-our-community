import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const SiteFooter = () => (
  <footer id="footer" className="border-t bg-card py-12 md:py-16">
    <div className="container">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <img src={logo} alt="Лого" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-heading text-base font-bold">УН към 163 ОУ</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Училищно настоятелство към 163 ОУ &bdquo;Черноризец Храбър&ldquo; — нестопанска организация, посветена на подобряването на училищния живот чрез родителска ангажираност и сътрудничество.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Бързи връзки</h3>
          <ul className="space-y-2">
            {[
              { label: "Инициативи", href: "/актуално?category=Инициатива", route: true },
              { label: "Новини", href: "/актуално?category=Новина", route: true },
              { label: "Настоятелство", href: "/настоятелство", route: true },
              { label: "Документи", href: "/#documents", route: false },
              { label: "Станете член", href: "/включи-се", route: true },
            ].map((link) => (
              <li key={link.label}>
                {link.route
                  ? <Link to={link.href} className="text-sm text-foreground hover:text-primary transition-colors">{link.label}</Link>
                  : <a href={link.href} className="text-sm text-foreground hover:text-primary transition-colors">{link.label}</a>
                }
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Контакти</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href="mailto:un@163ou.org" className="hover:text-primary transition-colors">un@163ou.org</a>
            </li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href="tel:+359889359988" className="hover:text-primary transition-colors">+359 889 35 99 88</a>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 text-primary shrink-0" />
              <a href="https://maps.app.goo.gl/cdxJ8iSdgAemU2rcA" target="_blank" rel="noopener noreferrer"
                className="hover:text-primary transition-colors">
                гр. София, ж.к. Дружба,<br />ул. Обиколна 29, 163 ОУ
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Училищно настоятелство към 163 ОУ &bdquo;Черноризец Храбър&ldquo;. Всички права запазени.
      </div>
    </div>
  </footer>
);

export default SiteFooter;

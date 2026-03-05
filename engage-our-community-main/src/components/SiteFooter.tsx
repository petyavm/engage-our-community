import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpg";

const SiteFooter = () => {
  return (
    <footer id="footer" className="border-t bg-card py-12 md:py-16">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img src={logo} alt="Лого" className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-heading text-base font-bold">УН към 163 ОУ</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Училищно настоятелство към 163 ОУ „Черноризец Храбър" — нестопанска организация, посветена на подобряването на училищния живот чрез родителска ангажираност и сътрудничество.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Бързи връзки</h3>
            <ul className="space-y-2">
              {[
                { label: "Инициативи", href: "#initiatives" },
                { label: "Новини", href: "#news" },
                { label: "Документи", href: "#documents" },
                { label: "Дейности", href: "#what-we-do" },
                { label: "Включи се", href: "#join" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-foreground hover:text-primary transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Контакти</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                un163ou@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                +359 2 987 6543
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                гр. София, район Искър
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Училищно настоятелство към 163 ОУ „Черноризец Храбър". Всички права запазени.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { supabase, type BoardMember } from "@/lib/supabase";
import { Mail, Phone, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

const history = [
  { mandate: "1993 – 1995", name: "Любомир Цанов", role: "Председател на УН", note: "Основател — първи председател на настоятелството, създадено на 20.01.1993 г." },
  { mandate: "1996 – 1998", name: "Григор Цветков", role: "Председател на УН", note: "По негово време е приет първият Устав на настоятелството." },
  { mandate: "1999 – 2003", name: "Красимир Матов", role: "Председател на УС", note: "Офицер в Българската армия, баща на две деца. При него сдружението е регистрирано официално в СГС на 10.08.2001 г." },
  { mandate: "2004 – 2006", name: "Николай Драгнев", role: "Председател на УС", note: "Инженер в ботаническата градина на БАН, баща на три деца." },
  { mandate: "2007 – 2013", name: "Тодор Тодоров", role: "Председател на УС", note: "Офицер в Българската армия, баща на две деца." },
  { mandate: "2014 – 2023", name: "Георги Христов", role: "Председател на УС", note: "Предприемач, баща на две деца. Най-дългият мандат в историята на настоятелството." },
  { mandate: "2023 – досега", name: "Петя Вълчева-Маркова", role: "Председател на УС", note: "Настоящ председател.", current: true },
];

const BoardPage = () => {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("board_members").select("*").order("sort_order")
      .then(({ data }) => { if (data) setMembers(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-primary py-14 md:py-20">
          <div className="container max-w-3xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Управителен съвет</p>
            <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">Настоятелство</h1>
            <p className="text-lg text-primary-foreground/80">
              Сдружение Училищно настоятелство към 163 ОУ &bdquo;Черноризец Храбър&ldquo; е създадено на 20.01.1993 г. и регистрирано официално в СГС на 10.08.2001 г.
            </p>
          </div>
        </section>

        {/* Current Board */}
        <section className="py-14 md:py-20">
          <div className="container">
            <h2 className="mb-10 text-2xl font-bold md:text-3xl">Текущ управителен съвет</h2>
            {loading ? (
              <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {members.map(m => (
                  <div key={m.id} className="rounded-2xl border bg-card overflow-hidden transition-shadow hover:shadow-md">
                    {m.image_url ? (
                      <div className="h-56 overflow-hidden bg-accent">
                        <img src={m.image_url} alt={m.name} className="h-full w-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-accent">
                        <span className="text-4xl font-bold text-primary/30">{m.initials || m.name.slice(0, 2)}</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-bold">{m.name}</h3>
                      <p className="mb-3 text-sm font-medium text-primary">{m.role}</p>
                      {m.description && <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{m.description}</p>}
                      <div className="space-y-1.5">
                        {m.email && <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"><Mail className="h-3.5 w-3.5" />{m.email}</a>}
                        {m.phone && <a href={`tel:${m.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"><Phone className="h-3.5 w-3.5" />{m.phone}</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* History */}
        <section className="bg-secondary py-14 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">История на настоятелството</h2>
              <p className="mb-10 text-muted-foreground">
                Настоятелството е създадено от група родители и учители на учредително събрание на 20.01.1993 г. Регистрирано е като ЮЛНЦ на 10.08.2001 г. в Софийски градски съд под номер 7975, Булстат/ЕИК: 130956514.
              </p>

              <div className="relative space-y-0">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
                {history.map((h, i) => (
                  <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
                    <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${h.current ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                      <span className="text-xs font-bold">{h.mandate.slice(0, 4)}</span>
                    </div>
                    <div className={`flex-1 rounded-xl border p-5 ${h.current ? "border-primary/30 bg-primary/5" : "bg-card"}`}>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h.mandate}</span>
                        {h.current && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">Настоящ</span>}
                      </div>
                      <h3 className="font-heading text-lg font-bold">{h.name}</h3>
                      <p className="text-sm font-medium text-primary mb-2">{h.role}</p>
                      <p className="text-sm text-muted-foreground">{h.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Organization info */}
        <section className="py-14 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 md:p-10">
              <h2 className="mb-6 text-xl font-bold">Информация за сдружението</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Регистрация", value: "СГС 7975/2001" },
                  { label: "Булстат/ЕИК", value: "130956514" },
                  { label: "Дата на основаване", value: "20.01.1993 г." },
                  { label: "Регистрирано като ЮЛНЦ", value: "10.08.2001 г." },
                  { label: "Имейл", value: "un@163ou.org" },
                  { label: "Адрес", value: "гр. София 1582, ж.к. Дружба 2, ул. Обиколна 36, ет. 2" },
                ].map(item => (
                  <div key={item.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/включи-се" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Станете член
                </Link>
                <Link to="/контакти" className="rounded-lg border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                  Свържете се с нас
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BoardPage;

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "react-router-dom";
import { CheckCircle2, Download, Mail, Phone, MapPin, Clock, ArrowLeft, Users, Heart, BookOpen, MessageCircle } from "lucide-react";

const benefits = [
  { icon: Users, title: "Участие в общото събрание", description: "Право на глас при вземане на важни решения за бъдещето на училището." },
  { icon: Heart, title: "Активно доброволчество", description: "Участвайте в организирането на събития, базари и инициативи за децата." },
  { icon: BookOpen, title: "Образователни инициативи", description: "Включете се в програми за подкрепа на обучението и извънкласните дейности." },
  { icon: MessageCircle, title: "Застъпничество", description: "Представлявайте интересите на родителите пред училищната администрация." },
];

const steps = [
  { number: "01", title: "Изтеглете заявлението", description: "Свалете формуляра за членство в PDF формат от бутона по-долу." },
  { number: "02", title: "Попълнете и подпишете", description: "Попълнете вашите данни и подпишете заявлението." },
  { number: "03", title: "Изпратете заявлението", description: "Предайте го на приемно време в стаята на УН (ет. 2) или изпратете на имейл un@163ou.org." },
  { number: "04", title: "Потвърждение", description: "Управителният съвет разглежда заявлението и ще получите потвърждение по имейл." },
];

const JoinPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-primary py-14 md:py-20">
          <div className="container">
            <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Към началото
            </Link>
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Присъединете се</p>
              <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                Станете член на УН към 163 ОУ
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Всеки родител може да направи промяна. Присъединете се към нашата общност и помогнете за по-доброто бъдеще на децата ни.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-14 md:py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">Защо да станете член?</h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Като член на Училищното настоятелство вие получавате реален глас в развитието на 163 ОУ.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <b.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-heading text-base font-bold">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership conditions */}
        <section className="bg-secondary py-14 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-2xl font-bold md:text-3xl">Условия за членство</h2>
              <div className="space-y-4">
                {[
                  'Да сте родител, настойник или попечител на ученик в 163 ОУ \u201eЧерноризец Храбър\u201c',
                  "Да споделяте ценностите и целите на Сдружение Училищно настоятелство",
                  "Да подадете попълнено заявление за членство до Управителния съвет",
                  "Членството се одобрява от Управителния съвет на първото заседание след подаване на заявлението",
                  "Членският внос се определя от Общото събрание на сдружението",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-foreground">{item}</p>
                  </div>
                ))}
              </div>

              {/* Rights & Obligations */}
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-bold">Права на членовете</h3>
                  <ul className="space-y-2">
                    {[
                      "Участие и право на глас в Общото събрание",
                      "Избиране и право да бъдат избирани в ръководните органи",
                      "Достъп до информация за дейността на сдружението",
                      "Участие във всички инициативи и мероприятия",
                      "Право да правят предложения и да получават отговор",
                    ].map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-bold">Задължения на членовете</h3>
                  <ul className="space-y-2">
                    {[
                      "Спазване на Устава на сдружението",
                      "Плащане на членски внос в определените срокове",
                      "Активно участие в дейността на настоятелството",
                      "Съдействие за изпълнение на решенията на УС",
                      "Достойно представяне на сдружението",
                    ].map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to join steps */}
        <section className="py-14 md:py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">Как да се присъедините</h2>
              <p className="mx-auto max-w-xl text-muted-foreground">Процесът е лесен и отнема само няколко минути.</p>
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="relative space-y-8">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-5">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm z-10">
                      {step.number}
                    </div>
                    <div className="flex-1 pb-2 pt-2.5">
                      <h3 className="mb-1 font-heading text-lg font-bold">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Download + Contact CTA */}
        <section className="bg-primary py-14 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Download form */}
                <div className="rounded-2xl bg-primary-foreground/10 p-8 text-primary-foreground">
                  <Download className="mb-4 h-8 w-8" />
                  <h3 className="mb-2 text-xl font-bold">Заявление за членство</h3>
                  <p className="mb-6 text-sm text-primary-foreground/75 leading-relaxed">
                    Изтеглете формуляра, попълнете го и го предайте в стаята на УН или изпратете по имейл.
                  </p>
                  <a
                    href="http://un.163ou.org/wp-content/uploads/2019/06/zayavlenie-za-chlenstvo.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
                  >
                    <Download className="h-4 w-4" />
                    Изтегли заявлението (PDF)
                  </a>
                  <p className="mt-3 text-xs text-primary-foreground/50">
                    Ако линкът не работи, свържете се с нас по имейл за да получите формуляра.
                  </p>
                </div>

                {/* Contact info */}
                <div className="rounded-2xl bg-primary-foreground/10 p-8 text-primary-foreground">
                  <Mail className="mb-4 h-8 w-8" />
                  <h3 className="mb-2 text-xl font-bold">Свържете се с нас</h3>
                  <p className="mb-6 text-sm text-primary-foreground/75 leading-relaxed">
                    Имате въпроси? Свържете се с нас или ни посетете на приемно време.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2.5 text-sm">
                      <Mail className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                      <a href="mailto:un@163ou.org" className="hover:underline">un@163ou.org</a>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm">
                      <Phone className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                      <a href="tel:0883340806" className="hover:underline">0883 340 806</a>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60" />
                      <span>Стаята на УН, ет. 2,<br/>163 ОУ „Черноризец Храбър"<br/>ж.к. Дружба 2, ул. Обиколна 36</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm">
                      <Clock className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                      <span>Приемно време: всяка сряда 09:30–12:00</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default JoinPage;

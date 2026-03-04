import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [robot, setRobot] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert("Моля попълнете всички задължителни полета.");
      return;
    }
    if (!robot) {
      alert("Моля потвърдете, че не сте робот.");
      return;
    }
    setStatus("sending");
    try {
      // Send via mailto as fallback (Supabase edge function or EmailJS can be wired here)
      const body = `Изпратено от: ${form.name}\nИмейл: ${form.email}\n\nСъобщение:\n${form.message}`;
      window.location.href = `mailto:un@163ou.org?subject=${encodeURIComponent(form.subject || "Съобщение от сайта")}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-primary py-14 md:py-20">
          <div className="container max-w-3xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Контакти</p>
            <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">Свържете се с нас</h1>
            <p className="text-lg text-primary-foreground/80">Имате въпрос или искате да се включите? Пишете ни — ще се радваме да чуем от вас.</p>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container">
            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">

              {/* Contact Form */}
              <div>
                <h2 className="mb-6 text-xl font-bold">Изпратете съобщение</h2>
                {status === "sent" ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                    <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
                    <h3 className="mb-2 text-lg font-bold text-green-800">Благодарим ви!</h3>
                    <p className="text-sm text-green-700">Вашият имейл клиент беше отворен с попълненото съобщение. Моля изпратете го, за да го получим.</p>
                    <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); setRobot(false); }}
                      className="mt-4 text-sm font-semibold text-green-700 hover:underline">
                      Изпрати ново съобщение
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Вашето име <span className="text-destructive">*</span></label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="Иван Иванов"
                          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Имейл адрес <span className="text-destructive">*</span></label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="ivan@example.com"
                          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Тема</label>
                      <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="Относно..."
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Съобщение <span className="text-destructive">*</span></label>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        rows={5} placeholder="Вашето съобщение..."
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                    </div>

                    {/* Simple human check (reCAPTCHA requires a key — using checkbox as lightweight alternative) */}
                    <div className="flex items-center gap-3 rounded-lg border bg-secondary px-4 py-3">
                      <input type="checkbox" id="robot-check" checked={robot} onChange={e => setRobot(e.target.checked)}
                        className="h-5 w-5 accent-primary cursor-pointer" />
                      <label htmlFor="robot-check" className="text-sm font-medium cursor-pointer select-none">
                        Не съм робот
                      </label>
                      <div className="ml-auto text-2xl">🤖</div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Всички съобщения се изпращат до <strong>un@163ou.org</strong>
                    </p>

                    <button onClick={handleSubmit} disabled={status === "sending"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
                      <Send className="h-4 w-4" />
                      {status === "sending" ? "Изпращане..." : "Изпрати съобщение"}
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Контактна информация</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-xl border bg-card p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Имейл</p>
                      <a href="mailto:un@163ou.org" className="mt-0.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        un@163ou.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border bg-card p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Телефон (Председател)</p>
                      <a href="tel:+359889359988" className="mt-0.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        +359 889 35 99 88
                      </a>
                      <p className="mt-0.5 text-xs text-muted-foreground">Петя Вълчева-Маркова</p>
                    </div>
                  </div>

                  <a href="https://maps.app.goo.gl/cdxJ8iSdgAemU2rcA" target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 rounded-xl border bg-card p-5 hover:shadow-md transition-shadow group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Адрес</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        163 ОУ &bdquo;Черноризец Храбър&ldquo;
                      </p>
                      <p className="text-xs text-muted-foreground">гр. София, ж.к. Дружба, ул. Обиколна 29</p>
                      <p className="mt-1.5 text-xs font-semibold text-primary">Виж на картата →</p>
                    </div>
                  </a>
                </div>

                {/* Map embed */}
                <div className="overflow-hidden rounded-xl border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2933.1!2d23.407!3d42.657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z163+OU!5e0!3m2!1sbg!2sbg!4v1"
                    width="100%" height="240" style={{ border: 0 }} allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="163 ОУ на картата"
                  />
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

export default ContactPage;

import { Heart, Building2, QrCode, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase, type DonationInfo } from "@/lib/supabase";

const DonationSection = () => {
  const [bankDetails, setBankDetails] = useState<DonationInfo[]>([]);

  useEffect(() => {
    supabase
      .from("donation_info")
      .select("*")
      .then(({ data }) => { if (data) setBankDetails(data); });
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    toast({ title: `${label} копиран в клипборда` });
  };

  return (
    <section id="donate" className="py-16 md:py-24 bg-accent/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Подкрепете нашата мисия</h2>
          <p className="text-muted-foreground leading-relaxed">
            Вашето дарение помага за финансирането на проекти за подобряване на училището, образователни работилници и общностни дейности.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Банков превод</h3>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              Направете директен банков превод с данните по-долу.
            </p>
            <dl className="space-y-3">
              {bankDetails.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</dt>
                    <dd className="text-sm font-medium text-foreground">{item.value}</dd>
                  </div>
                  {(item.key === "iban" || item.key === "bic") && (
                    <button
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="mt-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label={`Копирай ${item.label}`}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border bg-card p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Други начини за дарение</h3>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Предпочитате друг начин? Приемаме дарения по няколко канала.</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="font-semibold">На място</strong> — Посетете ни в училището в приемно време</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="font-semibold">По време на събития</strong> — Може да дарите на всяко наше събитие или базар</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="font-semibold">Материални дарения</strong> — Приемаме и материали, книги, спортни пособия и др.</span>
              </li>
            </ul>
            <div className="mt-6 rounded-lg bg-accent/50 p-4 text-xs text-muted-foreground leading-relaxed">
              Всички дарения се използват изцяло за нуждите на училището и децата. При поискване се издава документ за дарение.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;

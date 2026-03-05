import { Heart, Building2, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase, type DonationInfo } from "@/lib/supabase";

const DonationSection = () => {
  const [bankDetails, setBankDetails] = useState<DonationInfo[]>([]);

  useEffect(() => {
    supabase.from("donation_info").select("*").then(({ data }) => { if (data) setBankDetails(data); });
  }, []);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    toast({ title: `${label} копиран в клипборда` });
  };

  return (
    <section id="donate" className="py-16 md:py-24 bg-accent/30">
      <div className="container">
        <div className="mx-auto max-w-xl text-center mb-10">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Подкрепете нашата мисия</h2>
          <p className="text-muted-foreground leading-relaxed">
            Вашето дарение помага за финансирането на проекти за подобряване на училището, образователни работилници и общностни дейности.
          </p>
        </div>
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Банков превод</h3>
            </div>
            <dl className="space-y-4">
              {bankDetails.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-foreground">{item.value}</dd>
                  </div>
                  {(item.key === "iban" || item.key === "bic") && (
                    <button onClick={() => copy(item.value, item.label)}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title={`Копирай ${item.label}`}>
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </dl>
            <p className="mt-6 rounded-lg bg-accent/60 p-3 text-xs leading-relaxed text-muted-foreground">
              Всички дарения се използват изцяло за нуждите на училището и децата. При поискване се издава документ за дарение.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;

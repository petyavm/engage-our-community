import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase, type Document } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { FileText, Download } from "lucide-react";

const DOC_CATEGORIES = ["Всички", "Основни", "Годишни финансови отчети", "Протоколи от ОС", "Протоколи от УС", "Други"];

const formatDate = (d?: string) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" });
};

const DocumentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get("category") || "Всички";

  useEffect(() => {
    supabase.from("documents").select("*").order("date", { ascending: false })
      .then(({ data }) => { if (data) setItems(data); setLoading(false); });
  }, []);

  const visible = activeTab === "Всички"
    ? items
    : items.filter(i => i.category === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-primary py-14 md:py-20">
          <div className="container">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Прозрачност</p>
              <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">Документи</h1>
              <p className="text-lg text-primary-foreground/80">Финансови отчети, протоколи от общи събрания и заседания на управителния съвет.</p>
            </div>
          </div>
        </section>

        <section className="sticky top-16 z-30 border-b bg-card">
          <div className="container">
            <div className="flex flex-wrap gap-1 py-2">
              {DOC_CATEGORIES.map(cat => (
                <button key={cat}
                  onClick={() => setSearchParams({ category: cat })}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${activeTab === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}>
                  {cat}
                  <span className="ml-1.5 text-xs opacity-60">
                    ({cat === "Всички" ? items.length : items.filter(i => i.category === cat).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container max-w-3xl">
            {loading && (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
            {!loading && visible.length === 0 && (
              <p className="py-20 text-center text-muted-foreground">Няма качени документи в тази категория.</p>
            )}
            {!loading && visible.length > 0 && (
              <div className="space-y-3">
                {visible.map(doc => (
                  <a key={doc.id} href={doc.url || "#"} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md group">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{doc.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {doc.category && activeTab === "Всички" && <span className="mr-2 rounded-full bg-accent px-2 py-0.5 text-xs">{doc.category}</span>}
                        {doc.date && <span className="mr-2">{formatDate(doc.date)}</span>}
                        {doc.type} · {doc.size}
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default DocumentsPage;

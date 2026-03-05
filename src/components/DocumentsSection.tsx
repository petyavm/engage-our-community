import { FileText, Download, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type Document } from "@/lib/supabase";

const TABS = ["Всички", "Годишни финансови отчети", "Протоколи от ОС", "Протоколи от УС", "Други"];

const formatDate = (d?: string) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" });
};

const DocumentsSection = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState("Всички");

  useEffect(() => {
    supabase.from("documents").select("*").order("date", { ascending: false })
      .then(({ data }) => { if (data) setDocuments(data); });
  }, []);

  const filtered = (activeTab === "Всички"
    ? documents
    : documents.filter(d => d.category === activeTab)
  ).slice(0, 5);

  const total = activeTab === "Всички"
    ? documents.length
    : documents.filter(d => d.category === activeTab).length;

  const seeAllLink = activeTab === "Всички"
    ? "/документи"
    : `/документи?category=${encodeURIComponent(activeTab)}`;

  return (
    <section id="documents" className="bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Прозрачност и документи</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Вярваме в пълната прозрачност. Достъп до нашите официални документи, отчети и протоколи.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card text-foreground border hover:bg-accent"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">Няма качени документи в тази категория.</p>
          )}
          {filtered.map(doc => (
            <a key={doc.id} href={doc.url || "#"} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{doc.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {doc.category && activeTab === "Всички" && <span className="mr-2 rounded-full bg-accent px-2 py-0.5 text-xs">{doc.category}</span>}
                  {doc.date && <span className="mr-2">{formatDate(doc.date)}</span>}
                  {doc.type} · {doc.size}
                </p>
              </div>
              <Download className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            </a>
          ))}

          {total > 5 && (
            <Link to={seeAllLink}
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed bg-card p-4 text-sm font-semibold text-primary hover:bg-accent transition-colors">
              Виж всички {total} документа
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;

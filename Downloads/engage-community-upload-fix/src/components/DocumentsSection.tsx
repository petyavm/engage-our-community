import { FileText, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, type Document } from "@/lib/supabase";

const DocumentsSection = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setDocuments(data); });
  }, []);

  return (
    <section id="documents" className="bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Прозрачност и документи</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Вярваме в пълната прозрачност. Достъп до нашите официални документи, отчети и протоколи.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{doc.type} · {doc.size}</p>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;

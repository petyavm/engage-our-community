import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, type NewsItem } from "@/lib/supabase";

const categoryColors: Record<string, string> = {
  "Инициатива": "bg-primary/10 text-primary",
  "Новина": "bg-accent text-accent-foreground",
  "Събитие": "bg-warning/10 text-warning",
  "Мнение": "bg-muted text-muted-foreground",
};

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setNewsItems(data); });
  }, []);

  return (
    <section id="news" className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl" id="initiatives">Последни новини и инициативи</h2>
            <p className="max-w-xl text-muted-foreground">
              Прочетете за нашите последни дейности, проекти и актуализации.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col rounded-xl border bg-card transition-shadow hover:shadow-md"
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[item.category] || ""}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="mb-2 font-heading text-base font-bold leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

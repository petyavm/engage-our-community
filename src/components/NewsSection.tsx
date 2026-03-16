import { ArrowRight, AlertCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type NewsItem, type Announcement } from "@/lib/supabase";

const categoryColors: Record<string, string> = {
  "Инициатива": "bg-primary/10 text-primary",
  "Новина": "bg-accent text-accent-foreground",
  "Събитие": "bg-warning/10 text-warning",
  "Мнение": "bg-muted text-muted-foreground",
  "Проект": "bg-primary/10 text-primary",
  "Ретроспекция": "bg-accent text-accent-foreground",
  "Застъпничество": "bg-muted text-muted-foreground",
};

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => { if (data) setNewsItems(data); });

    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setAnnouncements(data); });
  }, []);

  return (
    <section id="news" className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl" id="initiatives">Новини и съобщения</h2>
            <p className="max-w-xl text-muted-foreground">
              Последни дейности, проекти и важни съобщения от настоятелството.
            </p>
          </div>
          <Link to="/актуално" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline md:flex">
            Виж всички <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="mb-8 space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border bg-card p-5 ${
                  item.urgent ? "border-primary/30 ring-1 ring-primary/20" : ""
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  {item.urgent && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      <AlertCircle className="h-3 w-3" /> Важно
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {item.date}
                  </span>
                </div>
                <h3 className="mb-1 font-heading text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* News */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col rounded-xl border bg-card transition-shadow hover:shadow-md overflow-hidden"
            >
              {item.image_url && (
                <div className="overflow-hidden h-44">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[item.category] || "bg-muted text-muted-foreground"}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="mb-2 font-heading text-base font-bold leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{item.excerpt}</p>
                <Link
                  to={`/актуално/${item.slug || item.id}`}
                  className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Прочети повече <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/актуално" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Виж всички новини <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

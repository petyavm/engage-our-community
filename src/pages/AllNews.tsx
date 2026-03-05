import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type NewsItem } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight, Search } from "lucide-react";
import NewsThumbnail from "@/components/NewsThumbnail";

const categoryColors: Record<string, string> = {
  "Инициатива": "bg-primary/10 text-primary",
  "Новина": "bg-blue-100 text-blue-700",
  "Събитие": "bg-amber-100 text-amber-700",
  "Проект": "bg-green-100 text-green-700",
  "Ретроспекция": "bg-accent text-accent-foreground",
  "Застъпничество": "bg-purple-100 text-purple-700",
};

const AllNews = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [filtered, setFiltered] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("news").select("*").eq("published", true)
      .order("date", { ascending: false })
      .then(({ data }) => { if (data) setItems(data); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(items); return; }
    setFiltered(items.filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.excerpt.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, items]);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-primary py-14 md:py-20">
          <div className="container">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Актуално</p>
              <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">Новини и инициативи</h1>
              <p className="text-lg text-primary-foreground/80">Следете последните дейности, проекти и постижения на нашето настоятелство.</p>
            </div>
          </div>
        </section>

        <section className="sticky top-16 z-30 border-b bg-card">
          <div className="container flex justify-end py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Търсене..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-lg border bg-background pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-64" />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            {loading && <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}
            {!loading && filtered.length === 0 && <div className="py-20 text-center text-muted-foreground">Няма намерени новини.</div>}
            {!loading && filtered.length > 0 && (
              <div className="space-y-12">
                {featured && (
                  <Link to={`/актуално/${featured.slug || featured.id}`}
                    className="group grid overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg md:grid-cols-2">
                    <div className="aspect-video overflow-hidden bg-secondary md:aspect-auto">
                      {featured.image_url
                        ? <img src={featured.image_url} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        : <NewsThumbnail title={featured.title} category={featured.category} className="h-full min-h-[220px] w-full" />}
                    </div>
                    <div className="flex flex-col justify-center p-6 md:p-10">
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[featured.category] || "bg-muted text-muted-foreground"}`}>{featured.category}</span>
                        <span className="text-xs text-muted-foreground">{featured.date}</span>
                      </div>
                      <h2 className="mb-3 font-heading text-xl font-bold leading-snug group-hover:text-primary transition-colors md:text-2xl">{featured.title}</h2>
                      <p className="mb-5 text-sm leading-relaxed text-muted-foreground line-clamp-3">{featured.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        Прочети повече <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                )}
                {rest.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map(item => (
                      <Link key={item.id} to={`/актуално/${item.slug || item.id}`}
                        className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
                        {item.image_url
                          ? <div className="h-44 overflow-hidden"><img src={item.image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></div>
                          : <NewsThumbnail title={item.title} category={item.category} className="h-44 w-full" />}
                        <div className="flex flex-1 flex-col p-5">
                          <div className="mb-2 flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[item.category] || "bg-muted text-muted-foreground"}`}>{item.category}</span>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          <h3 className="mb-2 font-heading text-base font-bold leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                          <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{item.excerpt}</p>
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                            Прочети повече <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AllNews;

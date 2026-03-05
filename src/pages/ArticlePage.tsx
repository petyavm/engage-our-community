import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase, type NewsItem } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowLeft, Calendar, User, Tag, ArrowRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Инициатива": "bg-primary/10 text-primary",
  "Новина": "bg-accent text-accent-foreground",
  "Събитие": "bg-warning/10 text-warning",
  "Мнение": "bg-muted text-muted-foreground",
  "Проект": "bg-primary/10 text-primary",
  "Ретроспекция": "bg-accent text-accent-foreground",
  "Застъпничество": "bg-secondary-foreground/10 text-secondary-foreground",
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    // Try slug first, then id
    supabase.from("news").select("*").eq("slug", slug).eq("published", true).single()
      .then(({ data, error }) => {
        if (error || !data) {
          // fallback to id
          supabase.from("news").select("*").eq("id", slug).eq("published", true).single()
            .then(({ data: d2 }) => {
              setArticle(d2 || null);
              setLoading(false);
            });
        } else {
          setArticle(data);
          setLoading(false);
        }
      });
  }, [slug]);

  useEffect(() => {
    if (!article) return;
    supabase.from("news").select("*").eq("published", true)
      .eq("category", article.category).neq("id", article.id)
      .order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setRelated(data); });
  }, [article]);

  // SEO: update document title dynamically
  useEffect(() => {
    if (article) {
      document.title = `${article.seo_title || article.title} | УН към 163 ОУ`;
      // Update meta description
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "description"); document.head.appendChild(meta); }
      meta.setAttribute("content", article.seo_description || article.excerpt || "");
      // OG tags
      const setMeta = (prop: string, content: string) => {
        let el = document.querySelector(`meta[property="${prop}"]`);
        if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
        el.setAttribute("content", content);
      };
      setMeta("og:title", article.seo_title || article.title);
      setMeta("og:description", article.seo_description || article.excerpt || "");
      if (article.image_url) setMeta("og:image", article.image_url);
      setMeta("og:type", "article");
      setMeta("og:url", window.location.href);
    }
    return () => { document.title = 'УН към 163 ОУ „Черноризец Храбър"'; };
  }, [article]);

  if (loading) return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
      <SiteFooter />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container py-32 text-center">
        <h1 className="mb-4 text-2xl font-bold">Статията не е намерена</h1>
        <Link to="/актуално" className="text-primary hover:underline">← Обратно към новините</Link>
      </div>
      <SiteFooter />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero image or color banner */}
        {article.image_url ? (
          <div className="relative h-64 md:h-96 w-full overflow-hidden">
            <img src={article.image_url} alt={article.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="container">
                <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}>
                  {article.category}
                </span>
                <h1 className="text-2xl font-bold text-white md:text-4xl max-w-3xl leading-tight">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary py-14 md:py-20">
            <div className="container">
              <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold bg-primary-foreground/20 text-primary-foreground`}>
                {article.category}
              </span>
              <h1 className="max-w-3xl text-2xl font-bold text-primary-foreground md:text-4xl leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        )}

        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-3xl">
            {/* Back link */}
            <Link to="/актуално" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Всички новини
            </Link>

            {/* Meta info */}
            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {article.date}
              </span>
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {article.author}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" /> {article.category}
              </span>
            </div>

            {/* Excerpt / lead */}
            {article.excerpt && (
              <p className="mb-8 text-lg font-medium leading-relaxed text-foreground/80 border-l-4 border-primary pl-5">
                {article.excerpt}
              </p>
            )}

            {/* Full article text */}
            {article.full_text ? (
              <div
                className="prose prose-green max-w-none text-foreground
                  prose-headings:font-heading prose-headings:text-foreground
                  prose-p:leading-relaxed prose-p:text-foreground/80
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-li:text-foreground/80"
                dangerouslySetInnerHTML={{ __html: article.full_text.replace(/\n/g, "<br/>") }}
              />
            ) : (
              <div className="rounded-xl bg-secondary p-6 text-center text-muted-foreground">
                <p>Пълният текст на тази статия все още не е добавен.</p>
                <p className="mt-2 text-sm">Администраторът може да добави съдържание от <Link to="/admin" className="text-primary hover:underline">административния панел</Link>.</p>
              </div>
            )}

            {/* Share section */}
            <div className="mt-12 flex items-center gap-3 border-t pt-8">
              <span className="text-sm font-semibold text-muted-foreground">Сподели:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-[#1877F2] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Facebook
              </a>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                className="rounded-lg border px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Копирай линк
              </button>
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-5xl border-t pt-12">
              <h2 className="mb-6 text-xl font-bold">Още от категория „{article.category}"</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map(item => (
                  <Link key={item.id} to={`/актуално/${item.slug || item.id}`}
                    className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
                    {item.image_url ? (
                      <div className="h-40 overflow-hidden">
                        <img src={item.image_url} alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-accent/50">
                        <span className="text-2xl font-bold text-primary/15">163</span>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <span className="mb-1 text-xs text-muted-foreground">{item.date}</span>
                      <h3 className="font-heading text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        Прочети <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ArticlePage;

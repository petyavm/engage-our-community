import { AlertCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, type Announcement } from "@/lib/supabase";

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setAnnouncements(data); });
  }, []);

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Важни съобщения</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Бъдете в крак с последните новини от нашето настоятелство.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border bg-card p-5 md:p-6 ${
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
      </div>
    </section>
  );
};

export default AnnouncementsSection;

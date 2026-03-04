import { useEffect, useState } from "react";
import { supabase, type ImpactStat } from "@/lib/supabase";

const ImpactSection = () => {
  const [stats, setStats] = useState<ImpactStat[]>([]);

  useEffect(() => {
    supabase
      .from("impact_stats")
      .select("*")
      .order("sort_order")
      .then(({ data }) => { if (data) setStats(data); });
  }, []);

  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="container">
        <h2 className="mb-10 text-center text-2xl font-bold text-primary-foreground md:text-3xl">
          Нашето въздействие
        </h2>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="mb-1 text-3xl font-bold text-primary-foreground md:text-4xl">
                {stat.value}
              </div>
              <div className="text-sm text-primary-foreground/75">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;

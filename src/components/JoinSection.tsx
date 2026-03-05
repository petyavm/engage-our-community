import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const JoinSection = () => (
  <section id="join" className="py-16 md:py-24">
    <div className="container">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center md:p-12">
        <h2 className="mb-3 text-2xl font-bold md:text-3xl">Присъединете се към нас</h2>
        <p className="mb-6 text-muted-foreground">
          Всеки родител може да направи промяна. Независимо дали имате 30 минути на месец или искате да поемете активна роля — има място за вас.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/включи-се"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Станете член <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/контакти"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
            Свържете се с нас
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default JoinSection;

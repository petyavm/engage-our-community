import heroImage from "@/assets/hero-community.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Родители и деца на общностно събитие"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[hsl(var(--hero-overlay)/0.75)]" />
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">
            Заедно за бъдещето на нашите деца
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
            Ние сме общност от родители, които работят за подобряване на училищния живот чрез инициативи, диалог и обща ангажираност.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#initiatives" className="rounded-lg bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90">
              Инициативи
            </a>
            <a href="#news" className="rounded-lg bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90">
              Новини
            </a>
            <a href="#join" className="rounded-lg border border-primary-foreground/40 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
              Включи се
            </a>
            <a href="#footer" className="rounded-lg border border-primary-foreground/40 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
              Контакти
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

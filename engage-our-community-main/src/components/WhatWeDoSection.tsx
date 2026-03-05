import { Users, BookOpen, Heart, MessageCircle } from "lucide-react";

const cards = [
  {
    icon: Users,
    title: "Изграждане на общност",
    description: "Обединяваме родителите, за да създадем подкрепяща и приобщаваща училищна среда.",
  },
  {
    icon: BookOpen,
    title: "Образователни инициативи",
    description: "Организираме работилници, лекции и ресурси в подкрепа на обучението на децата.",
  },
  {
    icon: Heart,
    title: "Доброволчество",
    description: "Координираме доброволци за училищни събития, набиране на средства и проекти за подобрение.",
  },
  {
    icon: MessageCircle,
    title: "Застъпничество и диалог",
    description: "Представляваме гласа на родителите в диалога с училищната администрация и институциите.",
  },
];

const WhatWeDoSection = () => {
  return (
    <section id="what-we-do" className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Какво правим</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Нашето настоятелство работи в четири ключови направления, за да направи реална промяна в училищния живот.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold">{card.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;

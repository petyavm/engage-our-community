import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase, type BoardMember } from "@/lib/supabase";

const BoardSection = () => {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

  useEffect(() => {
    supabase
      .from("board_members")
      .select("*")
      .order("sort_order")
      .then(({ data }) => { if (data) setBoardMembers(data); });
  }, []);

  return (
    <section id="board" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Нашето настоятелство
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Запознайте се с отдадените доброволци, които ръководят училищното настоятелство.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {boardMembers.map((member) => (
            <Card key={member.id} className="text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={member.image_url} alt={member.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{member.name}</h3>
                  <span className="text-sm font-medium text-primary">{member.role}</span>
                  <p className="mt-2 text-sm text-muted-foreground">{member.description}</p>
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Mail className="h-3.5 w-3.5" /> {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Phone className="h-3.5 w-3.5" /> {member.phone}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardSection;

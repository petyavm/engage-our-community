import { useEffect, useState } from "react";
import { supabase, type GalleryImage } from "@/lib/supabase";

const GallerySection = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .order("sort_order")
      .then(({ data }) => { if (data) setImages(data); });
  }, []);

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Нашите дейности</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Моменти от нашите събития, работилници и общностни срещи.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-xl">
              <img
                src={img.url}
                alt={img.alt}
                className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

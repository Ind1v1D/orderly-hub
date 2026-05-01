import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import faqImg from "@/assets/faq.jpg";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Частые вопросы — BASTONE" },
      { name: "description", content: "Ответы на частые вопросы о замере, производстве, гарантии и ценах BASTONE." },
    ],
  }),
  component: FaqPage,
});

type Faq = { id: string; question: string; answer: string; sort_order: number };

function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("faqs").select("*").order("sort_order", { ascending: true }).then(({ data }) => {
      setFaqs(data ?? []);
      if (data && data[0]) setOpen(data[0].id);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <SiteNav />
      <section className="section-pad pt-32" style={{ background: "var(--color-warm-white)" }}>
        <div>
          <div className="tag-line mb-4">Частые вопросы</div>
          <h1 className="font-display font-bold" style={{ fontSize: "clamp(40px,5vw,64px)" }}>
            Всё, что вас<br /><em className="italic">интересует</em>
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 mt-16 items-start">
          <div className="relative overflow-hidden aspect-[3/4] sticky top-28" style={{ background: "var(--color-section-bg)" }}>
            <img src={faqImg} alt="Мастерская BASTONE" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-8 right-8 text-white font-display text-2xl font-semibold leading-tight">
              Реальный сервис<br />по созданию<br />кастомной мебели
            </div>
          </div>

          <div>
            {loading && <div className="text-muted-foreground">Загрузка...</div>}
            {!loading && faqs.length === 0 && <div className="text-muted-foreground">Нет вопросов.</div>}
            {faqs.map((f) => {
              const isOpen = open === f.id;
              return (
                <div key={f.id} className="border-b" style={{ borderColor: "var(--color-border)" }}>
                  <button onClick={() => setOpen(isOpen ? null : f.id)} className="w-full text-left py-7 flex justify-between items-center gap-6 hover:text-gold transition-colors">
                    <span className="text-base md:text-lg font-medium">{f.question}</span>
                    <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-lg flex-shrink-0 transition-all ${isOpen ? "rotate-45 text-white" : "text-muted-foreground"}`} style={{ borderColor: isOpen ? "var(--color-gold)" : "var(--color-border)", background: isOpen ? "var(--color-gold)" : "transparent" }}>+</span>
                  </button>
                  <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: isOpen ? 400 : 0 }}>
                    <p className="font-serif-elegant text-lg leading-relaxed text-muted-foreground font-light pb-7">{f.answer}</p>
                  </div>
                </div>
              );
            })}

            <div className="mt-10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: "var(--color-section-bg)" }}>
              <div>
                <div className="font-display text-xl font-semibold">Не нашли ответ?</div>
                <div className="text-sm text-muted-foreground mt-1">Оставьте заявку — мы перезвоним и всё расскажем.</div>
              </div>
              <Link to="/order" className="inline-block px-8 py-3.5 text-[12px] font-medium tracking-[1.5px] uppercase text-white transition-all hover:-translate-y-0.5" style={{ background: "var(--color-gold)" }}>
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
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

const submissionSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(100),
  email: z.string().trim().email("Неверный email").max(255),
  question: z.string().trim().min(10, "Минимум 10 символов").max(1000, "Максимум 1000 символов"),
});

function FaqPage() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("faqs").select("*").order("sort_order", { ascending: true }).then(({ data }) => {
      setFaqs(data ?? []);
      if (data && data[0]) setOpen(data[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user?.email) setEmail((e) => e || user.email!);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = submissionSchema.safeParse({ name, email, question });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("faq_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      question: parsed.data.question,
      user_id: user?.id ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Не удалось отправить вопрос. Попробуйте позже.");
      return;
    }
    toast.success("Спасибо! Мы ответим на ваш email.");
    setName("");
    setQuestion("");
    if (!user) setEmail("");
  };

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

            {/* Ask your question form */}
            <div className="mt-14 p-8 md:p-10" style={{ background: "var(--color-section-bg)" }}>
              <div className="tag-line mb-3">Не нашли ответ?</div>
              <h2 className="font-display text-3xl font-semibold mb-2">Задайте свой вопрос</h2>
              <p className="text-sm text-muted-foreground mb-8">Мы ответим на ваш email в течение рабочего дня.</p>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] tracking-[1.5px] uppercase text-muted-foreground block mb-2">Имя</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      required
                      className="w-full px-4 py-3 bg-white border outline-none focus:border-gold transition-colors text-sm"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[1.5px] uppercase text-muted-foreground block mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                      required
                      className="w-full px-4 py-3 bg-white border outline-none focus:border-gold transition-colors text-sm"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-[1.5px] uppercase text-muted-foreground block mb-2">Вопрос</label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-white border outline-none focus:border-gold transition-colors text-sm resize-none"
                    style={{ borderColor: "var(--color-border)" }}
                    placeholder="Опишите, что вас интересует..."
                  />
                  <div className="text-[11px] text-muted-foreground mt-1 text-right">{question.length}/1000</div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-block px-8 py-3.5 text-[12px] font-medium tracking-[1.5px] uppercase text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                    style={{ background: "var(--color-gold)" }}
                  >
                    {submitting ? "Отправляем..." : "Отправить вопрос"}
                  </button>
                  <Link to="/order" className="text-[12px] uppercase tracking-[1.5px] text-ink-soft hover:text-gold transition-colors border-b border-current pb-0.5">
                    Или оставить заявку
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

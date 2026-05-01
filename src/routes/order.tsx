import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Field } from "./login";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Оформить заказ — BASTONE" },
      { name: "description", content: "Оформите заказ на кастомную мебель BASTONE." },
    ],
  }),
  component: OrderPage,
});

const FURNITURE = ["Кухонный гарнитур", "Шкаф / гардероб", "Мебель для гостиной", "Спальный гарнитур", "Офисная мебель"];
const BUDGETS = ["от 300 000 ₸", "500 000 — 1 000 000 ₸", "1 000 000 — 3 000 000 ₸", "от 3 000 000 ₸"];

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  furnitureType: z.string().min(1, "Выберите тип"),
  budget: z.string().min(1, "Выберите бюджет"),
  description: z.string().max(2000).optional(),
});

type Order = {
  id: string;
  full_name: string;
  phone: string;
  furniture_type: string;
  budget: string;
  description: string | null;
  status: string;
  created_at: string;
};

function OrderPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [furnitureType, setFurnitureType] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.full_name) setFullName(data.full_name);
      if (data?.phone) setPhone(data.phone);
    });
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadOrders() {
    if (!user) return;
    const { data, error } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setOrders(data ?? []);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const parsed = schema.safeParse({ fullName, phone, furnitureType, budget, description });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      furniture_type: parsed.data.furnitureType,
      budget: parsed.data.budget,
      description: parsed.data.description || null,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Заявка отправлена! Мы свяжемся с вами в течение 3 часов.");
    setDescription("");
    setFurnitureType("");
    setBudget("");
    loadOrders();
  }

  if (loading || !user) {
    return (
      <div>
        <SiteNav />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-muted-foreground">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SiteNav />
      <section className="section-pad pt-32 grid lg:grid-cols-2 gap-16 text-white" style={{ background: "linear-gradient(135deg, var(--color-ink) 0%, #2A2520 100%)" }}>
        <div>
          <div className="tag-line mb-4">Оформление заказа</div>
          <h1 className="font-display font-bold text-white" style={{ fontSize: "clamp(36px,4vw,54px)" }}>
            Расскажите нам<br />о вашей идее
          </h1>
          <p className="font-serif-elegant text-lg mt-5 text-white/60 font-light max-w-md">
            Заполните форму, и мы свяжемся с вами в течение трёх часов для согласования замера.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {["Бесплатная консультация", "Ответ в течение 3 часов", "Замер на следующий день"].map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/70 text-sm">
                <span style={{ color: "var(--color-gold)" }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DarkField label="Имя" type="text" value={fullName} onChange={setFullName} placeholder="Ваше имя" />
          <DarkField label="Телефон" type="tel" value={phone} onChange={setPhone} placeholder="+7 (700) 000-00-00" />
          <DarkSelect label="Тип мебели" value={furnitureType} onChange={setFurnitureType} options={FURNITURE} placeholder="Выберите тип" />
          <DarkSelect label="Бюджет" value={budget} onChange={setBudget} options={BUDGETS} placeholder="Диапазон бюджета" />
          <div className="flex flex-col gap-2">
            <label className="text-[11px] tracking-[2px] uppercase font-medium text-white/40">Описание проекта</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Стиль, особые пожелания..."
              className="px-4 py-3.5 text-base outline-none transition-colors min-h-[120px] resize-y focus:border-[color:var(--color-gold)]"
              style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "#fff" }} />
          </div>
          <button disabled={submitting} type="submit" className="mt-2 self-start px-12 py-4 text-[13px] font-medium tracking-[2px] uppercase text-white transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "var(--color-gold)" }}>
            {submitting ? "Отправляем..." : "Запросить консультацию →"}
          </button>
        </form>
      </section>

      <section className="section-pad" style={{ background: "var(--color-warm-white)" }}>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="tag-line mb-3">История заявок</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Ваши заказы</h2>
          </div>
          <Link to="/faq" className="text-sm uppercase tracking-[1.5px] text-gold border-b border-gold pb-1 hover:text-ink">Частые вопросы →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-muted-foreground" style={{ background: "var(--color-section-bg)" }}>Пока нет заявок. Заполните форму выше.</div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <div key={o.id} className="p-7 grid md:grid-cols-[1fr_auto] items-start gap-4" style={{ background: "var(--color-section-bg)" }}>
                <div>
                  <div className="font-display text-xl font-semibold">{o.furniture_type}</div>
                  <div className="text-sm text-muted-foreground mt-1">{o.budget}</div>
                  {o.description && <p className="text-sm mt-3 text-ink-soft">{o.description}</p>}
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 text-[11px] uppercase tracking-[1.5px] text-white" style={{ background: "var(--color-gold)" }}>{statusLabel(o.status)}</div>
                  <div className="text-xs text-muted-foreground mt-2">{new Date(o.created_at).toLocaleDateString("ru-RU")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}

function statusLabel(s: string) {
  return ({ new: "Новая", in_progress: "В работе", done: "Завершён" } as Record<string, string>)[s] ?? s;
}

function DarkField(p: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] tracking-[2px] uppercase font-medium text-white/40">{p.label}</label>
      <input
        type={p.type}
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        placeholder={p.placeholder}
        className="px-4 py-3.5 text-base outline-none transition-colors focus:border-[color:var(--color-gold)]"
        style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "#fff" }}
      />
    </div>
  );
}

function DarkSelect(p: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] tracking-[2px] uppercase font-medium text-white/40">{p.label}</label>
      <select
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        className="px-4 py-3.5 text-base outline-none transition-colors focus:border-[color:var(--color-gold)]"
        style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "#fff" }}
      >
        <option value="" style={{ background: "var(--color-ink)" }}>{p.placeholder}</option>
        {p.options.map((o) => <option key={o} value={o} style={{ background: "var(--color-ink)" }}>{o}</option>)}
      </select>
    </div>
  );
}

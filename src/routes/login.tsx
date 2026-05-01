import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Вход — BASTONE" },
      { name: "description", content: "Войдите в личный кабинет BASTONE." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Некорректный email").max(255),
  password: z.string().min(6, "Минимум 6 символов").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/order" });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Добро пожаловать!");
    navigate({ to: "/order" });
  }

  return (
    <div>
      <SiteNav />
      <section className="section-pad min-h-screen flex items-center justify-center pt-32" style={{ background: "var(--color-cream)" }}>
        <div className="w-full max-w-md p-10 md:p-12" style={{ background: "var(--color-warm-white)", boxShadow: "0 24px 60px rgba(0,0,0,.06)" }}>
          <div className="tag-line mb-4">Личный кабинет</div>
          <h1 className="font-display text-4xl font-bold mb-8">Вход</h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Пароль" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            <button disabled={loading} type="submit" className="mt-2 px-10 py-4 text-[13px] font-medium tracking-[1.5px] uppercase text-white transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "var(--color-gold)" }}>
              {loading ? "Входим..." : "Войти"}
            </button>
          </form>
          <p className="mt-7 text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-gold hover:text-ink border-b border-gold pb-0.5">Зарегистрироваться</Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

export function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] tracking-[2px] uppercase font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-3.5 text-base bg-transparent border outline-none transition-colors focus:border-gold"
        style={{ borderColor: "var(--color-border)" }}
      />
    </div>
  );
}

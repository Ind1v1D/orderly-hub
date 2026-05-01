import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Регистрация — BASTONE" },
      { name: "description", content: "Создайте аккаунт BASTONE для оформления заказов." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Введите имя").max(120),
  phone: z.string().trim().min(6, "Введите телефон").max(40),
  email: z.string().trim().email("Некорректный email").max(255),
  password: z.string().min(6, "Минимум 6 символов").max(72),
});

function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/order" });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, phone, email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/order`,
        data: { full_name: parsed.data.fullName, phone: parsed.data.phone },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Аккаунт создан! Проверьте почту для подтверждения.");
    navigate({ to: "/login" });
  }

  return (
    <div>
      <SiteNav />
      <section className="section-pad min-h-screen flex items-center justify-center pt-32" style={{ background: "var(--color-cream)" }}>
        <div className="w-full max-w-md p-10 md:p-12" style={{ background: "var(--color-warm-white)", boxShadow: "0 24px 60px rgba(0,0,0,.06)" }}>
          <div className="tag-line mb-4">Новый клиент</div>
          <h1 className="font-display text-4xl font-bold mb-8">Регистрация</h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <Field label="Имя" type="text" value={fullName} onChange={setFullName} placeholder="Александр Волков" />
            <Field label="Телефон" type="tel" value={phone} onChange={setPhone} placeholder="+7 (700) 000-00-00" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Пароль" type="password" value={password} onChange={setPassword} placeholder="Минимум 6 символов" />
            <button disabled={loading} type="submit" className="mt-2 px-10 py-4 text-[13px] font-medium tracking-[1.5px] uppercase text-white transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: "var(--color-gold)" }}>
              {loading ? "Создаём..." : "Создать аккаунт"}
            </button>
          </form>
          <p className="mt-7 text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-gold hover:text-ink border-b border-gold pb-0.5">Войти</Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

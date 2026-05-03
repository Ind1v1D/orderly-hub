import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Field } from "./login";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Профиль — BASTONE" },
      { name: "description", content: "Личный кабинет BASTONE: редактируйте свои данные." },
    ],
  }),
  component: ProfilePage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Минимум 2 символа").max(120, "Максимум 120 символов"),
  phone: z.string().trim().max(40, "Максимум 40 символов").optional().or(z.literal("")),
});

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setFullName(data?.full_name ?? "");
        setPhone(data?.phone ?? "");
        setAvatarUrl(data?.avatar_url ?? null);
        setLoading(false);
      });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Максимум 5 МБ");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Только изображения");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      setUploading(false);
      toast.error("Не удалось загрузить");
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = pub.publicUrl;
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ avatar_url: url, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setUploading(false);
    if (dbErr) {
      toast.error("Не удалось сохранить");
      return;
    }
    setAvatarUrl(url);
    toast.success("Фото обновлено");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = schema.safeParse({ fullName, phone });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: parsed.data.fullName, phone: parsed.data.phone ?? "", updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Не удалось сохранить");
      return;
    }
    toast.success("Профиль обновлён");
  };

  if (authLoading || !user) {
    return (
      <div>
        <SiteNav />
        <div className="pt-32 section-pad text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <SiteNav />
      <section className="section-pad pt-32" style={{ background: "var(--color-warm-white)" }}>
        <div className="tag-line mb-4">Личный кабинет</div>
        <h1 className="font-display font-bold" style={{ fontSize: "clamp(40px,5vw,64px)" }}>
          Ваш <em className="italic">профиль</em>
        </h1>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 mt-12 items-start">
          <div className="p-8" style={{ background: "var(--color-section-bg)" }}>
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4" style={{ background: "var(--color-warm-white)", border: "2px solid var(--color-gold)" }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Аватар" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-4xl font-bold text-gold">
                    {(fullName || user.email || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white bg-black/50">
                    Загрузка...
                  </div>
                )}
              </div>
              <label className="cursor-pointer text-[11px] tracking-[1.5px] uppercase text-ink-soft hover:text-gold transition-colors border-b border-current pb-0.5">
                {avatarUrl ? "Сменить фото" : "Загрузить фото"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <div className="mt-8 text-[11px] tracking-[1.5px] uppercase text-muted-foreground mb-2">Email</div>
            <div className="font-display text-lg break-all">{user.email}</div>
            <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
              <Link to="/order" className="text-[12px] uppercase tracking-[1.5px] text-ink-soft hover:text-gold transition-colors border-b border-current pb-0.5">
                Мои заказы →
              </Link>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white" style={{ border: "1px solid var(--color-border)" }}>
            <h2 className="font-display text-2xl font-semibold mb-6">Редактировать данные</h2>
            {loading ? (
              <div className="text-muted-foreground text-sm">Загрузка...</div>
            ) : (
              <form onSubmit={handleSave} className="grid gap-5">
                <Field label="Полное имя" type="text" value={fullName} onChange={setFullName} placeholder="Иван Иванов" />
                <Field label="Телефон" type="tel" value={phone} onChange={setPhone} placeholder="+7 ..." />
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-2 inline-block px-8 py-3.5 text-[12px] font-medium tracking-[1.5px] uppercase text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 self-start"
                  style={{ background: "var(--color-gold)" }}
                >
                  {saving ? "Сохраняем..." : "Сохранить"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

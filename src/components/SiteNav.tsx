import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between h-[72px] px-6 md:px-20 backdrop-blur-md transition-shadow"
      style={{
        background: "color-mix(in oklch, var(--color-warm-white) 92%, transparent)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,.08)" : "none",
      }}
    >
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-ink relative flex items-center justify-center overflow-hidden">
          <div className="absolute w-5 h-5 rounded-full border-[3px]" style={{ borderColor: "var(--color-gold)" }} />
          <div className="absolute w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-gold-light)" }} />
        </div>
        <div className="leading-tight">
          <div className="font-display font-bold text-[20px] tracking-[2px] text-ink">BASTONE</div>
          <div className="text-[9px] tracking-[3px] uppercase text-muted-foreground">Artisan Woodworks</div>
        </div>
      </Link>

      <ul className="hidden md:flex gap-9 list-none">
        {[
          { to: "/", label: "Главная" },
          { to: "/portfolio", label: "Портфолио" },
          { to: "/order", label: "Заказ" },
          { to: "/faq", label: "FAQ" },
        ].map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-[13px] tracking-[1px] uppercase font-medium text-ink-soft hover:text-gold transition-colors"
              activeProps={{ style: { color: "var(--color-gold)" } }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden sm:inline text-[12px] text-muted-foreground truncate max-w-[160px]">
              {user.email}
            </span>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="text-[12px] uppercase tracking-[1.5px] text-ink-soft hover:text-gold transition-colors"
            >
              Выйти
            </button>
          </>
        ) : (
          <Link to="/login" className="text-[12px] uppercase tracking-[1.5px] text-ink-soft hover:text-gold transition-colors">
            Войти
          </Link>
        )}
        <Link
          to="/order"
          className="inline-flex items-center px-6 py-2.5 text-[12px] font-medium tracking-[1.5px] uppercase text-white transition-all hover:-translate-y-0.5"
          style={{ background: "var(--color-gold)" }}
        >
          Заказать
        </Link>
      </div>
    </nav>
  );
}

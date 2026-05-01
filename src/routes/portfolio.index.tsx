import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { portfolioItems } from "@/lib/portfolio-data";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Портфолио — BASTONE" },
      { name: "description", content: "Реализованные проекты BASTONE: кухни, гардеробы, гостиные и TV-зоны под ключ." },
      { property: "og:title", content: "Портфолио — BASTONE" },
      { property: "og:description", content: "Реализованные проекты BASTONE по индивидуальным размерам." },
    ],
  }),
  component: PortfolioIndex,
});

function PortfolioIndex() {
  return (
    <div>
      <SiteNav />
      <section className="section-pad pt-32" style={{ background: "var(--color-warm-white)" }}>
        <div className="tag-line mb-4">Наши работы</div>
        <h1 className="font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(40px,5vw,72px)" }}>
          Портфолио<br /><em className="italic">проектов</em>
        </h1>
        <p className="font-serif-elegant text-xl leading-relaxed text-muted-foreground font-light max-w-2xl mt-6">
          Каждый проект — это диалог с пространством, материалом и человеком, который в нём живёт.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          {portfolioItems.map((p) => (
            <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }} className="group relative overflow-hidden block">
              <img src={p.img} alt={p.name} loading="lazy" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 transition-opacity flex items-end p-7 opacity-0 group-hover:opacity-100" style={{ background: "linear-gradient(to top, rgba(26,26,26,.85) 0%, transparent 55%)" }}>
                <div className="text-white">
                  <div className="text-[10px] tracking-[3px] uppercase font-medium mb-1.5" style={{ color: "var(--color-gold-light)" }}>{p.cat}</div>
                  <div className="font-display text-2xl font-semibold">{p.name}</div>
                  <div className="text-xs text-white/70 mt-2">{p.location} · {p.year}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

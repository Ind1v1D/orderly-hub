import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getPortfolioItem, portfolioItems, type PortfolioItem } from "@/lib/portfolio-data";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const item = getPortfolioItem(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Портфолио BASTONE` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: `${loaderData.name} — BASTONE` },
          { property: "og:description", content: loaderData.summary },
          { property: "og:image", content: loaderData.img },
        ]
      : [{ title: "Проект — BASTONE" }],
  }),
  component: PortfolioDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--color-warm-white)" }}>
      <h1 className="font-display text-5xl font-bold mb-4">Проект не найден</h1>
      <Link to="/portfolio" className="text-gold border-b border-gold pb-1 uppercase tracking-[1.5px] text-sm">К портфолио</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function PortfolioDetail() {
  const item = Route.useLoaderData() as PortfolioItem;
  const others = portfolioItems.filter((p) => p.slug !== item.slug).slice(0, 3);

  return (
    <div>
      <SiteNav />

      <section className="pt-32 pb-12 px-6 md:px-20" style={{ background: "var(--color-warm-white)" }}>
        <Link to="/portfolio" className="text-[12px] tracking-[1.5px] uppercase text-muted-foreground hover:text-gold transition-colors">
          ← Все проекты
        </Link>
        <div className="tag-line mt-8 mb-4">{item.cat}</div>
        <h1 className="font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(40px,5vw,72px)" }}>
          {item.name}
        </h1>
        <p className="font-serif-elegant text-xl leading-relaxed text-muted-foreground font-light max-w-2xl mt-6">
          {item.summary}
        </p>
      </section>

      <section className="px-6 md:px-20 pb-16">
        <div className="aspect-[16/9] overflow-hidden">
          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="section-pad pt-0 grid lg:grid-cols-[1fr_1.4fr] gap-16">
        <div>
          <div className="tag-line mb-6">О проекте</div>
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-muted-foreground uppercase tracking-[1.5px] text-[11px] mb-1">Локация</dt>
              <dd className="font-display text-lg">{item.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground uppercase tracking-[1.5px] text-[11px] mb-1">Год</dt>
              <dd className="font-display text-lg">{item.year}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground uppercase tracking-[1.5px] text-[11px] mb-1">Площадь</dt>
              <dd className="font-display text-lg">{item.area}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground uppercase tracking-[1.5px] text-[11px] mb-2">Материалы</dt>
              <dd className="flex flex-wrap gap-2">
                {item.materials.map((m) => (
                  <span key={m} className="text-xs px-3 py-1.5 border" style={{ borderColor: "var(--color-border)" }}>
                    {m}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="tag-line mb-6">Детали</div>
          <ul className="space-y-5">
            {item.details.map((d, i) => (
              <li key={i} className="flex gap-4 font-serif-elegant text-lg leading-relaxed text-ink-soft font-light">
                <span style={{ color: "var(--color-gold)" }}>—</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: "var(--color-section-bg)" }}>
            <div>
              <div className="font-display text-xl font-semibold">Хотите такой же проект?</div>
              <div className="text-sm text-muted-foreground mt-1">Оставьте заявку — обсудим вашу идею.</div>
            </div>
            <Link to="/order" className="inline-block px-8 py-3.5 text-[12px] font-medium tracking-[1.5px] uppercase text-white transition-all hover:-translate-y-0.5" style={{ background: "var(--color-gold)" }}>
              Заказать
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="tag-line mb-8">Другие проекты</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {others.map((p) => (
            <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }} className="group relative overflow-hidden block">
              <img src={p.img} alt={p.name} loading="lazy" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6" style={{ background: "linear-gradient(to top, rgba(26,26,26,.85) 0%, transparent 60%)" }}>
                <div className="text-white">
                  <div className="text-[10px] tracking-[3px] uppercase font-medium mb-1.5" style={{ color: "var(--color-gold-light)" }}>{p.cat}</div>
                  <div className="font-display text-xl font-semibold">{p.name}</div>
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

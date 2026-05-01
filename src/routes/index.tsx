import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import hero from "@/assets/hero.jpg";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BASTONE — Artisan Woodworks" },
      { name: "description", content: "Эксклюзивная корпусная мебель по вашим размерам — от эскиза до установки." },
      { property: "og:title", content: "BASTONE — Artisan Woodworks" },
      { property: "og:description", content: "Премиальная мебель ручной работы в Казахстане." },
    ],
  }),
  component: IndexPage,
});

const services = [
  { n: "01", name: "Персональный дизайн", d: "Разрабатываем проект под ваш интерьер, вкус и функциональные задачи." },
  { n: "02", name: "Экспертные замеры", d: "Лазерное сканирование с учётом всех неровностей, розеток и архитектурных нюансов." },
  { n: "03", name: "Качественные материалы", d: "Blum, Häfele, натуральные шпоны, сертифицированные плиты E1 и E0.5." },
  { n: "04", name: "Профессиональная установка", d: "Монтаж в срок, без пыли и лишних хлопот. Гарантия 24 месяца." },
];

const portfolio = [
  { img: p1, cat: "Кухня · Дуб + Эмаль", name: "Резиденция на Аль-Фараби", area: "1/6 / 1/2" },
  { img: p2, cat: "Кухонный остров · Кварц", name: "Penthouse Nurly Tau", area: "6/10 / 1/2" },
  { img: p3, cat: "Гардероб · Орех", name: "Апартаменты Riverside", area: "10/13 / 1/3" },
  { img: p4, cat: "Гостиная · MDF", name: "Студия дизайна", area: "1/4 / 2/3" },
  { img: p5, cat: "TV-консоль · Шпон", name: "Вилла в Горном Гиганте", area: "4/10 / 2/3" },
];

const steps = [
  { t: "Консультация", d: "Обсуждаем идеи, бюджет и стилевые предпочтения" },
  { t: "Замер", d: "Лазерное сканирование пространства" },
  { t: "Проект", d: "3D-визуализация и спецификация материалов" },
  { t: "Производство", d: "Изготовление 25–40 дней" },
  { t: "Установка", d: "Профессиональный монтаж без пыли" },
];

const testimonials = [
  { letter: "А", text: "Заказывал мебель для всей квартиры. Специалисты помогли с планировкой и установили всё точно в срок. Удобно, когда одна компания отвечает и за производство, и за установку.", name: "Александр Волков", role: "Доволный клиент · Алматы" },
  { letter: "Е", text: "Ребята идеально реализуют мебель по моим чертежам. Весь цикл — от замеров до монтажа — проходит безупречно. Качество фурнитуры и стыков всегда на высоте.", name: "Елена Маркова", role: "Дизайнер «Interior Pro»" },
];

function FadeUp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.08 });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);
  return (
    <div
      ref={setRef}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity .7s ease, transform .7s ease",
      }}
    >
      {children}
    </div>
  );
}

function IndexPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    { q: "Как проходит процесс замера?", a: "Специалист проведёт лазерные измерения с учётом розеток и неровностей стен. Финальный расчёт — за 48 часов." },
    { q: "Сколько занимает производство?", a: "Стандартный срок — 25–40 рабочих дней в зависимости от сложности проекта." },
    { q: "Есть ли гарантия?", a: "24 месяца гарантии на всю мебель и фурнитуру с бесплатной регулировкой." },
  ];

  return (
    <div className="overflow-x-hidden">
      <SiteNav />

      {/* HERO */}
      <section className="grid md:grid-cols-2 min-h-screen relative">
        <div className="flex flex-col justify-end px-6 md:px-20 pt-32 pb-24 relative z-10" style={{ background: "linear-gradient(135deg, var(--color-cream) 60%, transparent)" }}>
          <div className="tag-line mb-7">Мебель ручной работы · Казахстан</div>
          <h1 className="font-display font-bold leading-[1.05] text-ink mb-6" style={{ fontSize: "clamp(52px,6vw,86px)" }}>
            Your Vision,<br /><em className="italic" style={{ color: "var(--color-gold)" }}>Perfectly</em><br />Fitted.
          </h1>
          <p className="font-serif-elegant text-xl leading-relaxed text-muted-foreground font-light max-w-md mb-12">
            Эксклюзивная корпусная мебель, созданная по вашим размерам — от первого эскиза до безупречной установки.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/order" className="inline-block px-10 py-4 text-[13px] font-medium tracking-[1.5px] uppercase text-white transition-all hover:-translate-y-0.5" style={{ background: "var(--color-gold)" }}>
              Запросить консультацию
            </Link>
            <a href="#portfolio" className="inline-flex items-center gap-2.5 py-4 text-[13px] font-medium tracking-[1.5px] uppercase text-ink border-b border-ink hover:text-gold hover:border-gold transition-colors">
              Смотреть работы →
            </a>
          </div>
        </div>
        <div className="relative overflow-hidden h-[60vh] md:h-auto">
          <img src={hero} alt="Кастомная кухня BASTONE" width={1280} height={1280} className="w-full h-full object-cover" style={{ filter: "brightness(.92) saturate(1.1)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--color-cream) 0%, transparent 20%)" }} />
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-pad" id="services" style={{ background: "var(--color-warm-white)" }}>
        <FadeUp className="flex flex-wrap justify-between items-end gap-6 mb-16">
          <div>
            <div className="tag-line mb-4">Что мы делаем</div>
            <h2 className="font-display font-bold leading-[1.1]" style={{ fontSize: "clamp(36px,4vw,54px)" }}>
              Полный цикл<br /><em className="italic">от замера до монтажа</em>
            </h2>
          </div>
          <p className="font-serif-elegant text-lg leading-relaxed text-muted-foreground max-w-xl font-light">
            Мы берём на себя каждый этап — проектируем, производим и устанавливаем мебель.
          </p>
        </FadeUp>
        <FadeUp className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
          {services.map((s) => (
            <div key={s.n} className="group p-9 transition-colors duration-300" style={{ background: "var(--color-section-bg)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-section-bg)")}
            >
              <div className="text-[11px] tracking-[3px] uppercase text-muted-foreground mb-9 font-medium group-hover:text-white/70 transition-colors">{s.n}</div>
              <div className="w-13 h-13 mb-7 flex flex-col justify-center gap-1.5">
                <div className="h-0.5 w-full bg-ink group-hover:bg-gold transition-colors" />
                <div className="h-0.5 w-3/5 bg-ink group-hover:bg-gold transition-colors" />
                <div className="h-0.5 w-4/5 bg-ink group-hover:bg-gold transition-colors" />
              </div>
              <div className="font-display text-xl font-semibold mb-4 group-hover:text-white transition-colors">{s.name}</div>
              <div className="text-sm leading-relaxed text-muted-foreground group-hover:text-white/60 transition-colors">{s.d}</div>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* PORTFOLIO */}
      <section className="section-pad" id="portfolio" style={{ background: "var(--color-section-bg)" }}>
        <FadeUp className="mb-12">
          <div className="tag-line mb-4">Наши работы</div>
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(36px,4vw,54px)" }}>Портфолио</h2>
        </FadeUp>
        <FadeUp className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((p, i) => (
            <div key={i} className={`relative overflow-hidden cursor-pointer group ${i === 2 ? "md:row-span-2" : ""} ${i === 4 ? "md:col-span-2" : ""}`}>
              <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ minHeight: 280 }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-7" style={{ background: "linear-gradient(to top, rgba(26,26,26,.85) 0%, transparent 50%)" }}>
                <div className="text-white">
                  <div className="text-[10px] tracking-[3px] uppercase font-medium mb-1.5" style={{ color: "var(--color-gold-light)" }}>{p.cat}</div>
                  <div className="font-display text-2xl font-semibold">{p.name}</div>
                </div>
              </div>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* PROCESS */}
      <section className="section-pad text-white" style={{ background: "var(--color-ink)" }}>
        <FadeUp className="max-w-2xl">
          <div className="tag-line mb-4">Как мы работаем</div>
          <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(36px,4vw,54px)" }}>
            Пять шагов<br /><em className="italic">к идеальной мебели</em>
          </h2>
          <p className="font-serif-elegant text-lg mt-5 text-white/50 font-light">
            Прозрачный процесс — вы знаете, что происходит на каждом этапе.
          </p>
        </FadeUp>
        <FadeUp className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-16 relative">
          {steps.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="w-14 h-14 rounded-full mx-auto mb-7 flex items-center justify-center font-display text-xl font-semibold transition-colors group-hover:bg-gold group-hover:text-ink" style={{ border: "1px solid var(--color-gold)", color: "var(--color-gold)", background: "var(--color-ink)" }}>{i + 1}</div>
              <div className="font-display text-base font-semibold mb-3 text-white">{s.t}</div>
              <div className="text-xs leading-relaxed text-white/45">{s.d}</div>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* PARTNERS */}
      <section className="section-pad" style={{ background: "var(--color-warm-white)" }}>
        <FadeUp>
          <div className="tag-line mb-4">Технологическое превосходство</div>
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(36px,4vw,54px)" }}>Наши партнёры</h2>
        </FadeUp>
        <FadeUp className="grid grid-cols-3 md:grid-cols-6 mt-14 border-y" style={{ borderColor: "var(--color-border)" }}>
          {["Häfele", "Bosch", "Blum", "SMEG", "Grass", "Hettich"].map((p, i) => (
            <div key={p} className="px-6 py-12 flex items-center justify-center hover:bg-section-bg transition-colors" style={{ borderRight: i < 5 ? "1px solid var(--color-border)" : "none", background: "transparent" }}>
              <div className="font-display text-xl font-bold tracking-[2px] text-muted-foreground hover:text-ink uppercase transition-colors">{p}</div>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" style={{ background: "var(--color-section-bg)" }}>
        <FadeUp>
          <div className="tag-line mb-4">Довольные клиенты</div>
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(36px,4vw,54px)" }}>
            Что говорят<br /><em className="italic">о нашей работе</em>
          </h2>
        </FadeUp>
        <FadeUp className="grid md:grid-cols-2 gap-8 mt-16">
          {testimonials.map((t) => (
            <div key={t.name} className="p-12 transition-all hover:-translate-y-1 border-b-[3px] border-transparent hover:border-gold hover:shadow-2xl" style={{ background: "var(--color-warm-white)" }}>
              <div className="font-display text-7xl leading-none opacity-40 mb-5" style={{ color: "var(--color-gold)" }}>"</div>
              <p className="font-serif-elegant text-xl leading-relaxed italic font-light text-ink-soft mb-9">{t.text}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display text-lg font-semibold" style={{ background: "linear-gradient(135deg, var(--color-gold-light), var(--color-gold))" }}>{t.letter}</div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* FAQ teaser */}
      <section className="section-pad" id="faq" style={{ background: "var(--color-warm-white)" }}>
        <FadeUp>
          <div className="tag-line mb-4">Частые вопросы</div>
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(36px,4vw,54px)" }}>
            Всё, что вас<br /><em className="italic">интересует</em>
          </h2>
        </FadeUp>
        <FadeUp className="max-w-3xl mt-12">
          {faqs.map((f, i) => (
            <div key={i} className="border-b" style={{ borderColor: "var(--color-border)" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left py-7 flex justify-between items-center gap-6 hover:text-gold transition-colors">
                <span className="text-base md:text-lg font-medium">{f.q}</span>
                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-lg flex-shrink-0 transition-all ${openFaq === i ? "rotate-45 text-white" : "text-muted-foreground"}`} style={{ borderColor: openFaq === i ? "var(--color-gold)" : "var(--color-border)", background: openFaq === i ? "var(--color-gold)" : "transparent" }}>+</span>
              </button>
              <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                <p className="font-serif-elegant text-lg leading-relaxed text-muted-foreground font-light pb-7">{f.a}</p>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <Link to="/faq" className="text-sm tracking-[1.5px] uppercase font-medium text-gold hover:text-ink transition-colors border-b border-gold pb-1">
              Все вопросы →
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* CTA */}
      <section className="section-pad grid md:grid-cols-2 gap-16 items-center text-white" style={{ background: "linear-gradient(135deg, var(--color-ink) 0%, #2A2520 100%)" }}>
        <FadeUp>
          <div className="tag-line mb-4">Начать проект</div>
          <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(36px,4vw,54px)" }}>
            Расскажите нам<br />о вашей идее
          </h2>
          <p className="font-serif-elegant text-lg mt-5 text-white/50 font-light">
            Мы свяжемся с вами в течение трёх часов.
          </p>
        </FadeUp>
        <FadeUp className="flex flex-col gap-4">
          {["Бесплатная консультация", "Ответ в течение 3 часов", "Замер на следующий день"].map((t) => (
            <div key={t} className="flex items-center gap-3 text-white/70">
              <span style={{ color: "var(--color-gold)" }}>✓</span> {t}
            </div>
          ))}
          <Link to="/order" className="mt-6 inline-block self-start px-12 py-4 text-[13px] font-medium tracking-[2px] uppercase text-white transition-all hover:-translate-y-0.5" style={{ background: "var(--color-gold)" }}>
            Перейти к заказу →
          </Link>
        </FadeUp>
      </section>

      <SiteFooter />
    </div>
  );
}

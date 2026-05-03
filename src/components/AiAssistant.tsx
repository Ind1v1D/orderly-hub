import { useEffect, useRef, useState } from "react";

type Msg = { role: "bot" | "user"; text: string };

const QA: { q: string; a: string }[] = [
  {
    q: "Сколько стоит мебель?",
    a: "Стоимость зависит от материалов, размеров и сложности. Кухни — от 850 000 ₸, гардеробные — от 450 000 ₸. Точную цену рассчитаем после замера — он бесплатный.",
  },
  {
    q: "Сколько занимает изготовление?",
    a: "В среднем 4–6 недель с момента утверждения проекта и внесения предоплаты. Кухни под ключ — до 8 недель.",
  },
  {
    q: "Какие материалы вы используете?",
    a: "Массив дуба, ясеня, ореха, премиальные МДФ-фасады, итальянская и немецкая фурнитура (Blum, Hettich), кварцевые и каменные столешницы.",
  },
  {
    q: "Делаете ли замер?",
    a: "Да, выезд замерщика по Алматы и пригородам — бесплатно. В другие города — по договорённости.",
  },
  {
    q: "Какая гарантия?",
    a: "5 лет на корпус и 10 лет на фурнитуру Blum. Сервисное обслуживание — пожизненно.",
  },
  {
    q: "Как сделать заказ?",
    a: "Откройте раздел «Заказ», заполните форму — мы свяжемся в течение рабочего дня и согласуем замер.",
  },
  {
    q: "Где посмотреть работы?",
    a: "Все реализованные проекты с фото и деталями — в разделе «Портфолио».",
  },
];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [greeted, setGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      setTimeout(() => {
        setMessages([
          {
            role: "bot",
            text: "Здравствуйте! 👋 Меня зовут Аяна, я ИИ-ассистент мастерской BASTONE. Помогу узнать о наших услугах, ценах и сроках. Выберите вопрос ниже:",
          },
        ]);
      }, 300);
    }
  }, [open, greeted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = (item: { q: string; a: string }) => {
    setMessages((m) => [...m, { role: "user", text: item.q }]);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: item.a }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Открыть чат с ассистентом"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110"
        style={{ background: "var(--color-gold)" }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[520px] max-h-[calc(100vh-8rem)] flex flex-col shadow-2xl overflow-hidden bg-white"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-3 px-5 py-4" style={{ background: "var(--color-ink)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--color-gold)" }}>
              <span className="font-display text-white text-sm font-bold">А</span>
            </div>
            <div className="text-white">
              <div className="font-display font-semibold text-sm">Аяна · ИИ-ассистент</div>
              <div className="text-[10px] tracking-[1.5px] uppercase opacity-70 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Онлайн
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "var(--color-warm-white)" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "text-white rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"}`}
                  style={
                    m.role === "user"
                      ? { background: "var(--color-gold)" }
                      : { background: "white", border: "1px solid var(--color-border)", color: "var(--color-ink)" }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t max-h-[180px] overflow-y-auto" style={{ borderColor: "var(--color-border)" }}>
            <div className="text-[10px] tracking-[1.5px] uppercase text-muted-foreground mb-2 px-1">Готовые вопросы</div>
            <div className="flex flex-wrap gap-2">
              {QA.map((item) => (
                <button
                  key={item.q}
                  onClick={() => ask(item)}
                  className="text-xs px-3 py-1.5 transition-colors hover:text-white"
                  style={{ border: "1px solid var(--color-border)", background: "white" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

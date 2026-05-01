import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="px-6 md:px-20 pt-20 pb-12" style={{ background: "#111", color: "rgba(255,255,255,.6)" }}>
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1.5fr] mb-16">
        <div>
          <div className="font-display font-bold text-2xl tracking-[2px] text-white">BASTONE</div>
          <div className="text-[9px] tracking-[3px] uppercase text-white/40">Artisan Woodworks</div>
          <p className="text-sm leading-relaxed mt-5 text-white/40 max-w-[280px]">
            BASTONE — премиальный сервис по созданию кастомной мебели в Казахстане.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[3px] uppercase text-white/30 mb-5 font-medium">Навигация</h4>
          <Link to="/" className="block text-sm text-white/50 hover:text-gold mb-3">Главная</Link>
          <Link to="/order" className="block text-sm text-white/50 hover:text-gold mb-3">Заказ</Link>
          <Link to="/faq" className="block text-sm text-white/50 hover:text-gold mb-3">FAQ</Link>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[3px] uppercase text-white/30 mb-5 font-medium">Аккаунт</h4>
          <Link to="/login" className="block text-sm text-white/50 hover:text-gold mb-3">Войти</Link>
          <Link to="/register" className="block text-sm text-white/50 hover:text-gold mb-3">Регистрация</Link>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[3px] uppercase text-white/30 mb-5 font-medium">Свяжитесь с нами</h4>
          <div className="text-sm text-white/50 mb-2.5">
            Телефон: <a className="text-gold-light hover:text-gold" href="tel:+77001234567">+7 (700) 123-45-67</a>
          </div>
          <div className="text-sm text-white/50 mb-2.5">
            Email: <a className="text-gold-light hover:text-gold" href="mailto:info@bastone.com">info@bastone.com</a>
          </div>
          <div className="text-sm text-white/50">Алматы, ул. Тимирязева, 28</div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-7 flex flex-wrap justify-between items-center gap-3">
        <div className="text-xs text-white/20">© 2025 BASTONE. Все права защищены.</div>
        <div className="flex gap-6 text-xs text-white/20">
          <a href="#" className="hover:text-white/50">Политика конфиденциальности</a>
          <a href="#" className="hover:text-white/50">Условия использования</a>
        </div>
      </div>
    </footer>
  );
}

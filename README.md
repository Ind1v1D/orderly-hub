# BASTONE — Artisan Woodworks

Премиальный сайт мастерской кастомной мебели: лендинг, портфолио, заказы, FAQ, авторизация и личный кабинет с аватаром. Построен на TanStack Start (React 19 + SSR) с бэкендом Lovable Cloud (Supabase).

---

## ✨ Возможности

- **Главная страница** — hero, преимущества, портфолио-превью, CTA.
- **Портфолио** (`/portfolio`) — список проектов и динамические страницы каждого проекта (`/portfolio/$slug`) с материалами, локацией, годом и площадью.
- **FAQ** (`/faq`) — динамическая загрузка вопросов из БД + форма «Задать свой вопрос».
- **Заказ** (`/order`) — защищённая форма заявки с историей заказов пользователя.
- **Авторизация** (`/login`, `/register`) — email/пароль через Supabase Auth, валидация Zod.
- **Личный кабинет** (`/profile`) — редактирование имени и телефона + загрузка аватара (Supabase Storage, до 5 МБ).
- **ИИ-ассистент Аяна** — плавающий чат в правом нижнем углу: приветствует пользователя и отвечает на готовые вопросы (цены, сроки, материалы, гарантия).
- **Плавные переходы между страницами** — рандомизация трёх анимаций (fade, blur, slide-up) с поддержкой `prefers-reduced-motion`.

---

## 🛠 Стек

| Слой | Технология |
|---|---|
| Фреймворк | TanStack Start v1 (React 19, SSR/SSG) |
| Сборщик | Vite 7 |
| Стили | Tailwind CSS v4 + дизайн-токены в `src/styles.css` (oklch) |
| Маршрутизация | TanStack Router (file-based) |
| UI-кит | shadcn/ui (Radix + Tailwind) |
| Бэкенд | Lovable Cloud (Supabase: Auth, Postgres, Storage, RLS) |
| Валидация | Zod |
| Уведомления | Sonner |
| Иконки | Lucide |
| Деплой | Cloudflare Workers |

---

## 📁 Структура проекта

```
src/
├── routes/                    # File-based маршруты TanStack
│   ├── __root.tsx             # Корневой layout (PageTransition, AiAssistant, Toaster)
│   ├── index.tsx              # Главная
│   ├── portfolio.index.tsx    # /portfolio
│   ├── portfolio.$slug.tsx    # /portfolio/{slug}
│   ├── faq.tsx                # /faq + форма вопросов
│   ├── order.tsx              # /order (auth-gated)
│   ├── profile.tsx            # /profile (auth-gated, аватар)
│   ├── login.tsx
│   └── register.tsx
├── components/
│   ├── SiteNav.tsx
│   ├── SiteFooter.tsx
│   ├── AiAssistant.tsx        # Плавающий ИИ-чат
│   ├── PageTransition.tsx     # Анимации перехода между страницами
│   └── ui/                    # shadcn компоненты
├── lib/
│   ├── auth-context.tsx       # AuthProvider + useAuth
│   ├── portfolio-data.ts      # Данные проектов
│   └── utils.ts
├── integrations/supabase/     # Авто-генерируемые клиенты (НЕ редактировать)
├── assets/                    # Стоковые изображения
└── styles.css                 # Дизайн-токены + анимации
```

---

## 🗄 Схема БД (Supabase)

| Таблица | Назначение |
|---|---|
| `profiles` | `id`, `full_name`, `phone`, `avatar_url` — данные пользователя. Создаётся автоматически по триггеру `handle_new_user()`. |
| `orders` | Заявки на мебель: `furniture_type`, `budget`, `description`, `status`. |
| `faqs` | Опубликованные вопросы и ответы (читаемы всем). |
| `faq_submissions` | Вопросы от пользователей: `name`, `email`, `question`, `status`. |
| `storage.avatars` | Публичный bucket для фото профиля (загрузка только в свою папку `{user_id}/`). |

**Безопасность:** на каждой таблице включён Row-Level Security. Пользователь видит и редактирует только свои данные. FAQ-таблица доступна на чтение всем.

---

## 🤖 ИИ-ассистент

Компонент `AiAssistant.tsx` — плавающая кнопка в правом нижнем углу, доступна на всех страницах.

- При первом открытии — приветствие от Аяны.
- Все вопросы и ответы хранятся в массиве `QA` внутри компонента (без обращения к API).
- Чтобы добавить вопрос — допишите объект `{ q, a }` в массив.

---

## 🎬 Анимации переходов

`PageTransition.tsx` оборачивает `<Outlet />` и при смене `location.pathname` рандомно выбирает одну из трёх анимаций:

| Класс | Эффект |
|---|---|
| `.page-transition` | Fade + лёгкий подъём |
| `.page-transition-blur` | Размытие → резкость + scale |
| `.page-transition-slide` | Слайд снизу вверх |

CSS-keyframes описаны в `src/styles.css`. Уважается медиа-запрос `prefers-reduced-motion`.

---

## 🚀 Локальная разработка

```bash
# Установка
bun install

# Dev-сервер
bun run dev

# Сборка
bun run build
```

Проект работает в Lovable со встроенным Cloud — никаких `.env` настроек руками вписывать не нужно.

---

## 🔐 Переменные окружения

Управляются автоматически:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` — клиент.
- `SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY` — серверные секреты.

---

## 📝 Лицензия

Проект создан для мастерской BASTONE. Все права защищены.

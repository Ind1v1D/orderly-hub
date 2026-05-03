# BASTONE — Artisan Woodworks

Премиальный сайт мастерской кастомной мебели: лендинг, портфолио, заказы, FAQ, авторизация и личный кабинет с аватаром. Построен на TanStack Start (React 19 + SSR) с бэкендом Lovable Cloud (Supabase).

---

## ✨ Возможности

- **Главная страница** — hero, преимущества, портфолио-превью, CTA.
- **Портфолио** (`/portfolio`) — список проектов и динамические страницы каждого проекта с материалами, локацией, годом и площадью.
- **FAQ** (`/faq`) — динамическая загрузка вопросов из БД + форма «Задать свой вопрос».
- **Заказ** (`/order`) — защищённая форма заявки с историей заказов пользователя.
- **Авторизация** (`/login`, `/register`) — email/пароль через Supabase Auth.
- **Личный кабинет** (`/profile`) — редактирование имени и телефона + загрузка аватара (Supabase Storage, до 5 МБ).
- **ИИ-ассистент Аяна** — плавающий чат в правом нижнем углу: приветствует пользователя и отвечает на готовые вопросы (цены, сроки, материалы, гарантия).

---

## 🛠 Стек

| Слой | Технология |
|---|---|
| Фреймворк | React  |
| Сборщик | Vite |
| Стили | Tailwind CSS + дизайн-токены в `src/styles.css` |
| Маршрутизация | TanStack Router (file-based) |
| Бэкенд | Supabase: Auth, Postgres, Storage, RLS |

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


## 🚀 Локальная разработка

```bash
# Установка
bun install

# Dev-сервер
bun run dev

# Сборка
bun run build
```

---

## 🔐 Переменные окружения

Управляются автоматически:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` — клиент.
- `SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY` — серверные секреты.

---

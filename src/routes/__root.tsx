import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import { AiAssistant } from "@/components/AiAssistant";
import { PageTransition } from "@/components/PageTransition";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--color-warm-white)" }}>
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">Возможно, она была перемещена.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          На главную
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BASTONE — Artisan Woodworks · Кастомная мебель в Казахстане" },
      { name: "description", content: "Премиальная корпусная мебель ручной работы — от замера до установки. Кухни, гардеробы, гостиные." },
      { property: "og:title", content: "BASTONE — Artisan Woodworks · Кастомная мебель в Казахстане" },
      { name: "twitter:title", content: "BASTONE — Artisan Woodworks · Кастомная мебель в Казахстане" },
      { property: "og:description", content: "Премиальная корпусная мебель ручной работы — от замера до установки. Кухни, гардеробы, гостиные." },
      { name: "twitter:description", content: "Премиальная корпусная мебель ручной работы — от замера до установки. Кухни, гардеробы, гостиные." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2c57308-9924-4aec-8712-ba7ab0b8fad9/id-preview-3509089c--80b91bfa-dfc8-4cc6-b9b0-cd40151b9f00.lovable.app-1777821466657.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2c57308-9924-4aec-8712-ba7ab0b8fad9/id-preview-3509089c--80b91bfa-dfc8-4cc6-b9b0-cd40151b9f00.lovable.app-1777821466657.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <PageTransition>
        <Outlet />
      </PageTransition>
      <AiAssistant />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}

import { useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

const VARIANTS = ["page-transition", "page-transition-blur", "page-transition-slide"] as const;

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [key, setKey] = useState(location.pathname);
  const [variant, setVariant] = useState<string>(VARIANTS[0]);

  useEffect(() => {
    setVariant(VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
    setKey(location.pathname);
  }, [location.pathname]);

  return (
    <div key={key} className={variant}>
      {children}
    </div>
  );
}

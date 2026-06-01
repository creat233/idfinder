import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicHero } from "./PublicHero";
import { PublicHeroSober } from "./PublicHeroSober";

type Variant = "vapor" | "sober";

const STORAGE_KEY = "hero_ab_variant_v1";
const VISITOR_KEY = "hero_ab_visitor_v1";

const getVisitorId = () => {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};

const getVariant = (): Variant => {
  const forced = new URLSearchParams(window.location.search).get("hero");
  if (forced === "vapor" || forced === "sober") {
    localStorage.setItem(STORAGE_KEY, forced);
    return forced;
  }
  const stored = localStorage.getItem(STORAGE_KEY) as Variant | null;
  if (stored === "vapor" || stored === "sober") return stored;
  const v: Variant = Math.random() < 0.5 ? "vapor" : "sober";
  localStorage.setItem(STORAGE_KEY, v);
  return v;
};

const track = async (
  variant: Variant,
  event_type: "impression" | "cta_click",
  cta_label?: string,
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("hero_ab_events").insert({
      variant,
      event_type,
      cta_label: cta_label?.slice(0, 120) ?? null,
      visitor_id: getVisitorId(),
      user_id: user?.id ?? null,
      path: window.location.pathname,
      user_agent: navigator.userAgent.slice(0, 240),
    });
  } catch (e) {
    console.warn("hero_ab tracking failed", e);
  }
};

export const PublicHeroAB = () => {
  const [variant, setVariant] = useState<Variant | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = getVariant();
    setVariant(v);
    track(v, "impression");
  }, []);

  useEffect(() => {
    if (!variant || !sectionRef.current) return;
    const el = sectionRef.current;
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      const cta = target.closest("a, button");
      if (!cta) return;
      const label =
        cta.getAttribute("aria-label") ||
        cta.textContent?.trim() ||
        "unknown";
      track(variant, "cta_click", label);
    };
    el.addEventListener("click", onClick, true);
    return () => el.removeEventListener("click", onClick, true);
  }, [variant]);

  if (!variant) return <div style={{ minHeight: 600 }} />;

  return (
    <div ref={sectionRef} data-hero-variant={variant}>
      {variant === "vapor" ? <PublicHero /> : <PublicHeroSober />}
    </div>
  );
};

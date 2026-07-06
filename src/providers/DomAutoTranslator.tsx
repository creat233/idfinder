import { useContext, useEffect, useRef } from "react";
import { TranslationContext } from "./TranslationProvider";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = "dom_auto_translations_v1";
const ATTR_ORIG = "data-i18n-orig";
const ATTR_LANG = "data-i18n-lang";

type Cache = Record<string, Record<string, string>>; // { lang: { src: translated } }

const loadCache = (): Cache => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
};
const saveCache = (c: Cache) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
};

// Heuristic: skip strings that look like code, numbers, urls, or too short
const shouldTranslate = (s: string) => {
  const trimmed = s.trim();
  if (trimmed.length < 2) return false;
  if (!/[a-zA-ZÀ-ÿ]/.test(trimmed)) return false;
  if (/^https?:\/\//i.test(trimmed)) return false;
  if (/^[\d\s.,:%+\-/()€$£¥]+$/.test(trimmed)) return false;
  return true;
};

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "INPUT", "SVG"]);

export const DomAutoTranslator = () => {
  const ctx = useContext(TranslationContext);
  const lang = ctx?.currentLanguage || "fr";
  const cacheRef = useRef<Cache>(loadCache());
  const pendingRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nodeMapRef = useRef<Map<string, Set<Node>>>(new Map()); // src -> nodes waiting

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyToNode = (node: Text) => {
      const parent = node.parentElement;
      if (!parent) return;
      if (SKIP_TAGS.has(parent.tagName)) return;
      if (parent.closest("[data-no-translate]")) return;
      const raw = node.nodeValue || "";
      if (!shouldTranslate(raw)) return;

      // Determine original text (preserve leading/trailing whitespace)
      const leading = raw.match(/^\s*/)?.[0] || "";
      const trailing = raw.match(/\s*$/)?.[0] || "";
      const core = raw.slice(leading.length, raw.length - trailing.length);
      if (!core) return;

      // Track original on the parent element so we can restore or re-translate
      const orig = (node as any).__i18nOrig || core;
      (node as any).__i18nOrig = orig;

      if (lang === "fr") {
        if (node.nodeValue !== leading + orig + trailing) {
          node.nodeValue = leading + orig + trailing;
        }
        return;
      }

      const cached = cacheRef.current[lang]?.[orig];
      if (cached) {
        const next = leading + cached + trailing;
        if (node.nodeValue !== next) node.nodeValue = next;
        return;
      }

      // Queue for translation
      pendingRef.current.add(orig);
      let set = nodeMapRef.current.get(orig);
      if (!set) { set = new Set(); nodeMapRef.current.set(orig, set); }
      set.add(node);
      scheduleFlush();
    };

    const scan = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => {
          const p = (n as Text).parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
          const v = (n as Text).nodeValue || "";
          return shouldTranslate(v) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
      });
      let cur: Node | null = walker.nextNode();
      while (cur) {
        applyToNode(cur as Text);
        cur = walker.nextNode();
      }

      // Translate common attributes (placeholder, title, aria-label) on elements
      if ((root as Element).querySelectorAll) {
        const els = (root as Element).querySelectorAll("[placeholder],[title],[aria-label]");
        els.forEach((el) => translateAttrs(el as HTMLElement));
        if ((root as Element).matches && (root as Element).matches("[placeholder],[title],[aria-label]")) {
          translateAttrs(root as HTMLElement);
        }
      }
    };

    const translateAttrs = (el: HTMLElement) => {
      const attrs = ["placeholder", "title", "aria-label"];
      attrs.forEach((a) => {
        const v = el.getAttribute(a);
        if (!v || !shouldTranslate(v)) return;
        const origKey = `__attr_${a}`;
        const orig = (el as any)[origKey] || v;
        (el as any)[origKey] = orig;

        if (lang === "fr") {
          if (el.getAttribute(a) !== orig) el.setAttribute(a, orig);
          return;
        }
        const cached = cacheRef.current[lang]?.[orig];
        if (cached) {
          if (el.getAttribute(a) !== cached) el.setAttribute(a, cached);
          return;
        }
        pendingRef.current.add(orig);
        // Store the element+attr for later application
        const key = `__attrTargets_${orig}`;
        (window as any).__i18nAttrTargets = (window as any).__i18nAttrTargets || new Map();
        const map: Map<string, Array<{ el: HTMLElement; attr: string }>> =
          (window as any).__i18nAttrTargets;
        const list = map.get(orig) || [];
        list.push({ el, attr: a });
        map.set(orig, list);
        scheduleFlush();
      });
    };

    const scheduleFlush = () => {
      if (lang === "fr") { pendingRef.current.clear(); return; }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, 350);
    };

    const flush = async () => {
      if (lang === "fr") return;
      const items = Array.from(pendingRef.current).filter((t) => !inFlightRef.current.has(t));
      if (items.length === 0) return;
      pendingRef.current.clear();
      items.forEach((t) => inFlightRef.current.add(t));

      const chunks: string[][] = [];
      for (let i = 0; i < items.length; i += 40) chunks.push(items.slice(i, i + 40));

      try {
        const results = await Promise.all(
          chunks.map(async (chunk) => {
            const { data, error } = await supabase.functions.invoke("translate-ui", {
              body: { texts: chunk, targetLang: lang },
            });
            if (error) throw error;
            return { chunk, translations: (data?.translations ?? chunk) as string[] };
          })
        );

        cacheRef.current[lang] = cacheRef.current[lang] || {};
        for (const { chunk, translations } of results) {
          chunk.forEach((src, i) => {
            const tr = translations[i] ?? src;
            cacheRef.current[lang][src] = tr;

            // Apply to text nodes
            const nodes = nodeMapRef.current.get(src);
            if (nodes) {
              nodes.forEach((n) => {
                const raw = (n as Text).nodeValue || "";
                const leading = raw.match(/^\s*/)?.[0] || "";
                const trailing = raw.match(/\s*$/)?.[0] || "";
                (n as Text).nodeValue = leading + tr + trailing;
              });
              nodeMapRef.current.delete(src);
            }
            // Apply to attributes
            const attrMap: Map<string, Array<{ el: HTMLElement; attr: string }>> =
              (window as any).__i18nAttrTargets;
            if (attrMap) {
              const targets = attrMap.get(src);
              if (targets) {
                targets.forEach(({ el, attr }) => el.setAttribute(attr, tr));
                attrMap.delete(src);
              }
            }
          });
        }
        saveCache(cacheRef.current);
      } catch (e) {
        console.warn("[dom-i18n] failed", e);
      } finally {
        items.forEach((t) => inFlightRef.current.delete(t));
      }
    };

    // Initial scan
    scan(document.body);

    // Observe mutations
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE) {
              try { scan(n); } catch {}
            }
          });
        } else if (m.type === "characterData") {
          if (m.target.nodeType === Node.TEXT_NODE) {
            // Clear stored original so we pick up the new French source
            delete (m.target as any).__i18nOrig;
            applyToNode(m.target as Text);
          }
        } else if (m.type === "attributes" && m.target.nodeType === Node.ELEMENT_NODE) {
          translateAttrs(m.target as HTMLElement);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });

    document.documentElement.lang = lang;

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lang]);

  return null;
};

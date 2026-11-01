"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/SmoothScroll";
import { duration, gsap, prefersReducedMotion, setupMotion } from "@/lib/motion";
import type { Social } from "@/lib/types";

const items = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/enquire", label: "Enquire" },
];

type Props = { monogram: string; email?: string | null; socials: Social[] };

export default function Menu({ monogram, email, socials }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  const panelRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Close whenever the route changes.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    setupMotion();
    const panel = panelRef.current;
    if (!panel) return;
    const rows = panel.querySelectorAll("[data-menu-row]");
    const fast = prefersReducedMotion();

    if (open) {
      getLenis()?.stop();
      gsap.set(panel, { visibility: "visible" });
      gsap.fromTo(panel, { xPercent: fast ? 0 : 105, opacity: fast ? 0 : 1 }, { xPercent: 0, opacity: 1, duration: fast ? 0.15 : duration("base"), ease: "quart" });
      if (!fast) gsap.fromTo(rows, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: duration("base"), ease: "expo", stagger: 0.05, delay: 0.15 });
      firstLinkRef.current?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }

    getLenis()?.start();
    gsap.to(panel, {
      xPercent: fast ? 0 : 105,
      opacity: fast ? 0 : 1,
      duration: fast ? 0.15 : duration("fast") + 0.2,
      ease: "quart",
      onComplete: () => {
        gsap.set(panel, { visibility: "hidden" });
      },
    });
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((o) => !o)}
        className="ui-title fixed bottom-[calc(var(--gutter)-4px)] right-[var(--gutter)] z-50 min-h-12 px-1 text-[26px] md:text-[28px]"
      >
        Menu
      </button>

      <nav
        id="site-menu"
        ref={panelRef}
        aria-label="Site menu"
        aria-hidden={!open}
        className="instrument invisible fixed bottom-[var(--gutter)] right-[var(--gutter)] top-[var(--gutter)] z-[60] flex w-[calc(100%-var(--gutter)*2)] flex-col px-6 py-5 md:top-[calc(var(--gutter)*2+var(--hud-height)+12px)] md:w-[420px]"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[15px] font-bold">{monogram}</span>
          <button type="button" onClick={close} className="label min-h-11">
            Close ×
          </button>
        </div>

        <ol className="mt-auto">
          {items.map((item, i) => (
            <li key={item.href} data-menu-row className="border-t border-panel-line">
              <Link
                ref={i === 0 ? firstLinkRef : undefined}
                href={item.href}
                tabIndex={open ? 0 : -1}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="group flex h-16 items-center gap-5"
              >
                <span className="label text-muted-dark">{String(i + 1).padStart(2, "0")}</span>
                <span className={`ui-title transition-colors ${isActive(item.href) ? "text-on-ink" : "text-muted-dark group-hover:text-on-ink"}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div data-menu-row className="label mt-6 leading-[1.8] text-muted-dark">
          {email && (
            <a href={`mailto:${email}`} tabIndex={open ? 0 : -1} className="block hover:text-on-ink">
              {email}
            </a>
          )}
          <span className="flex flex-wrap gap-x-4">
            {socials.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="hover:text-on-ink">
                {s.label}
              </a>
            ))}
          </span>
        </div>
      </nav>
    </>
  );
}

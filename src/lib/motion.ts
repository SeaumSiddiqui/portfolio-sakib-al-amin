"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Reads a token from tokens.css so GSAP and CSS share one motion system. */
function token(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function bezier(name: string, fallback: string) {
  const match = token(name, fallback).match(/cubic-bezier\(([^)]+)\)/);
  return match ? match[1] : fallback.replace(/cubic-bezier\(|\)/g, "");
}

export function setupMotion() {
  if (registered) return gsap;
  gsap.registerPlugin(CustomEase, ScrollTrigger);
  CustomEase.create("expo", bezier("--ease-expo", "cubic-bezier(0.16, 1, 0.3, 1)"));
  CustomEase.create("quart", bezier("--ease-quart", "cubic-bezier(0.76, 0, 0.24, 1)"));
  registered = true;
  return gsap;
}

export function duration(kind: "fast" | "base" | "slow") {
  const fallback = { fast: "0.3", base: "0.7", slow: "1.2" }[kind];
  return parseFloat(token(`--dur-${kind}`, fallback));
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };

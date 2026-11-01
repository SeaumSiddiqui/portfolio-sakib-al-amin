"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Media as MediaType } from "@/lib/types";

type Props = {
  media?: MediaType | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Full film with controls and sound instead of a muted loop. */
  controls?: boolean;
  label?: string;
};

/** Renders a muted video loop, an image, or the placeholder swatch, in that order. */
export default function Media({ media, className = "", sizes = "50vw", priority, controls, label }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = media?.videoUrl;

  // HLS streams: Safari plays them natively, everything else needs hls.js.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl?.includes(".m3u8") || video.canPlayType("application/vnd.apple.mpegurl")) return;
    let destroy: (() => void) | undefined;
    import("hls.js").then(({ default: Hls }) => {
      if (!Hls.isSupported()) return;
      const hls = new Hls({ capLevelToPlayerSize: true });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      destroy = () => hls.destroy();
    });
    return () => destroy?.();
  }, [videoUrl]);

  // Loops only play while on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || controls) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [controls, videoUrl]);

  const isHls = videoUrl?.includes(".m3u8");

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: media?.swatch || "var(--color-canvas-2)" }}
      role={label && !videoUrl && !media?.imageUrl ? "img" : undefined}
      aria-label={label && !videoUrl && !media?.imageUrl ? label : undefined}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={isHls ? undefined : videoUrl}
          poster={media?.imageUrl || undefined}
          muted={!controls}
          loop={!controls}
          playsInline
          autoPlay={controls}
          controls={controls}
          preload={controls ? "auto" : "metadata"}
          aria-label={label}
        />
      ) : media?.imageUrl ? (
        <Image
          src={media.imageUrl}
          alt={media.alt || label || ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

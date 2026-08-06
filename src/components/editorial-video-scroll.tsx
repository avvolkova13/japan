"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { getEditorialScrollState } from "@/lib/editorial-scroll";

type OriginGeometry = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function EditorialVideoScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const origin = originRef.current;
    const media = mediaRef.current;
    const copy = copyRef.current;
    const video = videoRef.current;
    if (!section || !stage || !origin || !media || !copy || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileLayout = window.matchMedia("(max-width: 767px)");
    let geometry: OriginGeometry | null = null;
    let animationFrame: number | null = null;

    const usesStaticLayout = () => reducedMotion.matches || mobileLayout.matches;

    const measure = () => {
      section.classList.toggle("is-static", usesStaticLayout());

      if (usesStaticLayout()) {
        geometry = null;
        stage.style.setProperty("--copy-opacity", "1");
        copy.inert = false;
        copy.style.pointerEvents = "auto";
        media.classList.add("is-ready");
        return;
      }

      const originRect = origin.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      geometry = {
        left: originRect.left - stageRect.left,
        top: originRect.top - stageRect.top,
        width: originRect.width,
        height: originRect.height,
      };
    };

    const update = () => {
      animationFrame = null;
      if (usesStaticLayout() || !geometry) return;

      const scrollDistance = section.offsetHeight - window.innerHeight;
      const rawProgress = scrollDistance > 0
        ? -section.getBoundingClientRect().top / scrollDistance
        : 0;
      const state = getEditorialScrollState(rawProgress);
      const mediaProgressRemaining = 1 - state.mediaProgress;
      const left = geometry.left * mediaProgressRemaining;
      const top = geometry.top * mediaProgressRemaining;
      const width = geometry.width + (window.innerWidth - geometry.width) * state.mediaProgress;
      const height = geometry.height + (window.innerHeight - geometry.height) * state.mediaProgress;

      media.style.setProperty("--media-left", `${left}px`);
      media.style.setProperty("--media-top", `${top}px`);
      media.style.setProperty("--media-width", `${width}px`);
      media.style.setProperty("--media-height", `${height}px`);
      media.style.setProperty("--media-radius", `${6 * mediaProgressRemaining}px`);
      media.style.setProperty("--overlay-progress", String(state.overlayProgress));
      media.style.setProperty("--overlay-offset", `${18 * (1 - state.overlayProgress)}px`);
      stage.style.setProperty("--copy-opacity", String(state.copyOpacity));
      copy.inert = state.copyOpacity < 0.05;
      copy.style.pointerEvents = state.copyOpacity < 0.05 ? "none" : "auto";
      media.classList.add("is-ready");
    };

    const requestUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(update);
    };

    const handleResize = () => {
      measure();
      requestUpdate();
    };

    const handlePreferenceChange = () => {
      measure();
      if (reducedMotion.matches) {
        video.pause();
      } else {
        void video.play().catch(() => undefined);
      }
      requestUpdate();
    };

    measure();
    if (reducedMotion.matches) video.pause();
    else void video.play().catch(() => undefined);
    requestUpdate();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", handleResize);
    reducedMotion.addEventListener("change", handlePreferenceChange);
    mobileLayout.addEventListener("change", handlePreferenceChange);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", handleResize);
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      mobileLayout.removeEventListener("change", handlePreferenceChange);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="editorial-scroll" aria-labelledby="editorial-title">
      <div ref={stageRef} className="editorial-scroll-stage">
        <div className="editorial-scroll-grid section-pad">
          <div ref={originRef} className="editorial-scroll-origin">
            <div ref={mediaRef} className="editorial-scroll-media">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/videos/kanso/editorial-ritual-poster.jpg"
                aria-hidden="true"
                onError={() => mediaRef.current?.classList.add("has-video-error")}
              >
                <source src="/videos/kanso/editorial-ritual.mp4" type="video/mp4" />
              </video>
              <div className="editorial-scroll-shade" aria-hidden="true" />
              <div className="editorial-scroll-overlay">
                <span className="editorial-scroll-line" aria-hidden="true" />
                <p>ПУТЬ ОДНОЙ ФОРМУЛЫ</p>
                <p><em>От первого прикосновения —<br />к привычке, которая остается.</em></p>
              </div>
            </div>
          </div>
          <div ref={copyRef} className="editorial-copy editorial-scroll-copy">
            <p className="micro-label">Редакция</p>
            <h2 id="editorial-title">Японский подход к ежедневному уходу.</h2>
            <p>История о небольших повторяемых жестах, из которых складывается личный ритуал.</p>
            <Link className="button button-dark" href="/journal/japanese-approach">
              <span className="button-arrow" aria-hidden="true">
                <svg className="button-arrow-icon" viewBox="0 0 20 20" fill="none" focusable="false">
                  <path d="M3.67242 12.9971V2.5H4.67242V11.9971H15.7824L15.6133 11.9455L12.4346 8.69261L13.1494 7.99339L17.209 12.1477L17.5508 12.4973L17.209 12.8469L13.1494 17.0012L15.6162 13.0452L15.7753 12.9971H3.67242Z" fill="currentColor" />
                </svg>
              </span>
              <span className="button-label">Читать историю</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

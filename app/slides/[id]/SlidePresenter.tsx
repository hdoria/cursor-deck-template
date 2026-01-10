"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Slide } from "@/components/Slide";
import { SlideNav } from "@/components/SlideNav";
import { Slide as SlideType } from "@/app/types/slide";
import { SlideNavigation } from "@/lib/types";

interface SlidePresenterProps {
  slide: SlideType;
  navigation: SlideNavigation;
}

export function SlidePresenter({ slide, navigation }: SlidePresenterProps) {
  const router = useRouter();
  const { current, total, hasNext, hasPrev } = navigation;
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const goTo = useCallback(
    (id: number, dir: number) => {
      setDirection(dir);
      router.push(`/slides/${id}`);
    },
    [router]
  );

  const goNext = useCallback(() => {
    if (hasNext) goTo(current + 1, 1);
  }, [hasNext, current, goTo]);

  const goPrev = useCallback(() => {
    if (hasPrev) goTo(current - 1, -1);
  }, [hasPrev, current, goTo]);

  const goFirst = useCallback(() => {
    if (current !== 1) goTo(1, -1);
  }, [current, goTo]);

  const goLast = useCallback(() => {
    if (current !== total) goTo(total, 1);
  }, [current, total, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "Backspace":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          goFirst();
          break;
        case "End":
          e.preventDefault();
          goLast();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          // Number keys for quick jump (1-9)
          if (e.key >= "1" && e.key <= "9") {
            const targetSlide = parseInt(e.key, 10);
            if (targetSlide <= total) {
              e.preventDefault();
              goTo(targetSlide, targetSlide > current ? 1 : -1);
            }
          }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, goFirst, goLast, goTo, current, total, toggleFullscreen]);

  // Touch/swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        goNext(); // Swipe left -> next
      } else {
        goPrev(); // Swipe right -> prev
      }
    }

    setTouchStart(null);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-background"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <Slide key={slide.id} slide={slide} direction={direction} />
      </AnimatePresence>

      <SlideNav navigation={navigation} />

      {/* Top controls */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <Link
          href="/admin"
          className="px-3 py-1.5 text-xs rounded bg-surface/80 backdrop-blur-sm border border-surface-02 hover:bg-surface-02 transition-colors"
        >
          ← Editor
        </Link>
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded bg-surface/80 backdrop-blur-sm border border-surface-02 hover:bg-surface-02 transition-colors"
          title={isFullscreen ? "Sair da tela cheia (F)" : "Tela cheia (F)"}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0v5m0-5h5M15 9l5-5m0 0v5m0-5h-5M9 15l-5 5m0 0v-5m0 5h5M15 15l5 5m0 0v-5m0 5h-5" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          )}
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-8 right-8 text-foreground-muted/50 text-xs font-mono hidden md:block">
        ← → to navigate · F fullscreen
      </div>
    </div>
  );
}

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Safe wrapper around Next.js useRouter that schedules router navigation
 * inside React.startTransition to prevent "Router action dispatched before initialization"
 * errors during initial hydration or concurrent state updates.
 */
export function useSafeRouter() {
  const router = useRouter();

  const push = useCallback(
    (href: string) => {
      React.startTransition(() => {
        try {
          router.push(href);
        } catch (err) {
          console.warn("SafeRouter push notice:", err);
        }
      });
    },
    [router]
  );

  const replace = useCallback(
    (href: string) => {
      React.startTransition(() => {
        try {
          router.replace(href);
        } catch (err) {
          console.warn("SafeRouter replace notice:", err);
        }
      });
    },
    [router]
  );

  const back = useCallback(() => {
    React.startTransition(() => {
      try {
        router.back();
      } catch (err) {
        console.warn("SafeRouter back notice:", err);
      }
    });
  }, [router]);

  return {
    ...router,
    push,
    replace,
    back,
  };
}

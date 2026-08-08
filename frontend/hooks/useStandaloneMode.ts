"use client";

import { useState } from "react";

export function useStandaloneMode() {
  const [isStandalone] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const matchStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
      return matchStandalone || isIosStandalone;
    }
    return false;
  });

  return { isStandalone };
}

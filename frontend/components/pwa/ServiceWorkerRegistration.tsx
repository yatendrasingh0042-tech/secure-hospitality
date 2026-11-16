"use client";

import { useEffect } from "react";

export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // In development mode, unregister any active service workers to prevent slow reloads and stale caching
    if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
      if ("caches" in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful with scope: ", registration.scope);
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed: ", err);
        });
    });
  }, []);

  return null;
};

'use client';

import { useEffect } from 'react';

// Registers the PWA service worker in production only.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registration failure is non-fatal (e.g. unsupported context).
      });
    }
  }, []);

  return null;
}

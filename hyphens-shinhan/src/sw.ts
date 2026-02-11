import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();

// --- Web Push: 푸시 수신 시 알림 표시
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;
  let payload: { title?: string; body?: string; url?: string } = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "알림", body: event.data.text() || "새 알림이 있습니다." };
  }
  const title = payload.title ?? "Hyphen";
  const body = payload.body ?? "새 알림이 있습니다.";
  const url = payload.url ?? "/";
  const options: NotificationOptions = {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.url ?? "default",
    renotify: true,
    data: { url },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// --- Web Push: 알림 클릭 시 해당 URL로 포커스
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data?.url as string) ?? "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
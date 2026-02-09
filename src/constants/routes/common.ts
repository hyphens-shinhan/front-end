export const COMMON_ROUTES = {
  NOTIFICATION: '/notification',
  CHAT: '/chat',
  /** Chat conversation (match /chat/[userId]); use with startsWith for config. */
  CHAT_DETAIL_PREFIX: '/chat/',
  SEARCH: '/search',
} as const

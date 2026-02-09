export const COMMON_ROUTES = {
  NOTIFICATION: '/notification',
  CHAT: '/chat',
  /** Used as CUSTOM_HEADER_CONFIG key for chat detail; pathPattern matches /chat/[userId] */
  CHAT_DETAIL: '/chat/[userId]',
  SEARCH: '/search',
} as const

export const NOTIFIER_RESPONSE_MESSAGES = {
  OK: 'OK',
  ERROR: 'ERROR',
} as const

export type NotifierResponseMessage = keyof typeof NOTIFIER_RESPONSE_MESSAGES

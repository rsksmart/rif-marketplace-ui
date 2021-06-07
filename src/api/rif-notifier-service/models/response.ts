export const NOTIFIER_RESPONSE_STATUSES = {
  OK: 'OK',
  ERROR: 'ERROR',
  CONFLICT: 'CONFLICT',
} as const

export type NotifierResponseStatus = keyof typeof NOTIFIER_RESPONSE_STATUSES

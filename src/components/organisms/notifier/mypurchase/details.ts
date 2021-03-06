import { baseSubscriptionHeaders } from '../details/NotifierDetailsModal'

export const subscriptionHeaders = {
  ...baseSubscriptionHeaders,
  provider: 'Provider',
} as const

export type SubscriptionDetails = {
    [K in keyof typeof subscriptionHeaders]: string
  }

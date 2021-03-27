import { baseSubscriptionHeaders } from '../details/NotifierDetailsModal'

export const subscriptionHeaders = {
  ...baseSubscriptionHeaders,
  customer: 'Customer',
} as const

export type SubscriptionDetails = {
    [K in keyof typeof subscriptionHeaders]: string
  }

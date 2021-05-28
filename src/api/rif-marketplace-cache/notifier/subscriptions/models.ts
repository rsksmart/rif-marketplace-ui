import { SupportedEventChannel } from 'config/notifier'
import { PlanDTO } from '../offers/models'

export const EVENT_TYPES = {
  NEW_BLOCK: 'NEW_BLOCK',
  NEW_TRANSACTIONS: 'NEW_TRANSACTIONS',
  PENDING_TRANSACTIONS: 'PENDING_TRANSACTIONS',
  CONTRACT_EVENT: 'CONTRACT_EVENT',
} as const

export type SubscriptionEventType = keyof typeof EVENT_TYPES

export const EVENT_PARAM_TYPES = {
  EVENT_PARAM: 'EVENT_PARAM',
  EVENT_NAME: 'EVENT_NAME',
  CONTRACT_ADDRESS: 'CONTRACT_ADDRESS',
} as const

export type TopicParamType = keyof typeof EVENT_PARAM_TYPES

export type EventParam = {
  type: TopicParamType
  value: string
  valueType: string
}

export type SubscriptionEvent = {
  notificationPreferences: SupportedEventChannel | Array<SupportedEventChannel>
  type: SubscriptionEventType
  topicParams: Array<EventParam>
}

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  EXPIRED: 'EXPIRED',
  COMPLETED: 'COMPLETED',
} as const

export type SubscriptionStatus = keyof typeof SUBSCRIPTION_STATUS

export type SubscriptionDTO = {
  hash: string
  subscriptionId: number
  status: SubscriptionStatus
  plan: PlanDTO
  notificationBalance: number
  previousSubscription: string
  expirationDate: Date
  consumer: string
  topics: Array<SubscriptionEvent>
  paid: boolean
  price: string
  rateId: string
  providerId: string
}

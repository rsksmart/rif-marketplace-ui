export const TOPIC_TYPES = {
  NEW_BLOCK: 'NEW_BLOCK',
  NEW_TRANSACTIONS: 'NEW_TRANSACTIONS',
  PENDING_TRANSACTIONS: 'PENDING_TRANSACTIONS',
  CONTRACT_EVENT: 'CONTRACT_EVENT',
} as const

export type TopicType = keyof typeof TOPIC_TYPES

export const TOPIC_PARAM_TYPES = {
  EVENT_PARAM: 'EVENT_PARAM',
  EVENT_NAME: 'EVENT_NAME',
  CONTRACT_ADDRESS: 'CONTRACT_ADDRESS',
} as const
export type TopicParamType = keyof typeof TOPIC_PARAM_TYPES

export type TopicParams = {
  type: TopicParamType
  value: string
  valueType?: string
  indexed?: boolean
  order?: number
  filter?: string
}

export const NOTIFICATION_SVC_TYPES = {
  API: 'API',
  SMS: 'SMS',
  EMAIL: 'EMAIL',
} as const
export type NotificationServiceType = keyof typeof NOTIFICATION_SVC_TYPES

export type DestinationParams = {
  username: string
  password: string
  apiKey: string
}

export type NotificationPreference = {
  notificationService: NotificationServiceType
  destination: string
  destinationParams?: DestinationParams
}

export type TopicDTO = {
  notificationPreferences: Array<NotificationPreference>
  type: TopicType
  topicParams?: Array<TopicParams>
}

export const SUBSCRIPTION_STATUSES = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  COMPLETED: 'COMPLETED',
} as const

export type SubscriptionStatus = keyof typeof SUBSCRIPTION_STATUSES

export type CurrencyDTO = {
  name: string
  address: string
}

export type SubscriptionPayment = {
  amount: string
  subscription: SubscriptionDTO
  status: string
  currency: CurrencyDTO
}

export type SubscriptionDTO = {
  id: number
  hash: string
  apiKey: string
  activeSince: Date
  notificationBalance: number
  status: SubscriptionStatus
  expirationDate: Date
  paid: boolean
  subscriptionPayments: Array<SubscriptionPayment>
  subscriptionPlanId: number
  price: BigInteger
  currency: CurrencyDTO
  topics: Array<TopicDTO>
  userAddress: string
  providerAddress: string
  previousSubscription: SubscriptionDTO
  signature: string
}

export type SubscribeToPlanDTO = {
  userAddress: string
  price: string
  currency: string
  subscriptionPlanId: number
  topics: TopicDTO[]
}

export type SubscribeToPlanResponseDTO = {
  hash: string
  signature: string
  subscription: SubscriptionDTO
}

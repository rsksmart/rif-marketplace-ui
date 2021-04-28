export type SubscriptionTopic = {
  notificationPreferences: string | Array<string>
  type: string
  topicParams: Array<any>
}

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'EXPIRED'
  | 'COMPLETED'

export type SubscriptionDTO = {
  hash: string
  subscriptionId: number
  status: SubscriptionStatus
  subscriptionPlanId: number
  notificationBalance: number
  previousSubscription: string
  expirationDate: Date
  consumer: string
  topics: Array<SubscriptionTopic>
  paid: boolean
  price: string
  rateId: string
  providerId: string
}

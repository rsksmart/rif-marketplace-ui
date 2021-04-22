export type SubscriptionDTO = {
  hash: string
  subscriptionId: number
  status: string
  subscriptionPlanId: number
  previousSubscription: string
  expirationDate: Date
  consumer: string
  topics: Array<Record<string, string>>
  providerId: string
}

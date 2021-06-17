import { logNotImplemented } from 'utils/utils'
import { NotifierAPIService, NotifierResponse } from './interfaces'
import { NOTIFIER_RESPONSE_STATUSES } from './models/response'
import { SubscriptionDTO } from './models/subscriptions'

type SubscriptionResponse = NotifierResponse<Array<SubscriptionDTO>>

export type SubscriptionSummary = Pick<SubscriptionDTO, 'hash' | 'signature' | 'status'>

export const address = 'getSubscriptions' as const
export default class SubscriptionService
  extends NotifierAPIService {
  path = address

  _fetch = (filters: any): Promise<SubscriptionResponse> => this.service.find(filters)

  _create = (): Promise<any> => Promise.resolve(logNotImplemented('Create Subscription')())

  getPendingSubscription =
  async (user: string, planId: number):
  Promise<SubscriptionSummary|undefined> => {
    const response: SubscriptionResponse = await this._fetch({ headers: { userAddress: user } })
    const { status, content } = response

    if (status !== NOTIFIER_RESPONSE_STATUSES.OK) {
      this.errorReporter({
        error: new Error('Subscription fetch Error'),
        text: 'Error Getting pending subscription',
        id: 'service-fetch',
      })
    }
    const activeSubscriptions: Array<SubscriptionDTO> = content.filter((subscription) => {
      const { status: subscriptionStatus } = subscription
      return (subscriptionStatus === 'ACTIVE')
    })

    if (activeSubscriptions.length) {
      throw new Error('user already has an active subscription')
    }

    const pendingSubscriptions: Array<SubscriptionDTO> = content.filter((subscription) => {
      const { subscriptionPlanId, status: subscriptionStatus } = subscription
      return subscriptionPlanId === planId && (subscriptionStatus === 'PENDING')
    })

    if (pendingSubscriptions.length) {
      return pendingSubscriptions[0]
    }
    return undefined
  }
}

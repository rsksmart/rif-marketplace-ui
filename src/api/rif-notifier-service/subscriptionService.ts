import CustomError from 'models/CustomError'
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

  getUserSubscriptions =
  async (user: string):
  Promise<Array<SubscriptionDTO>> => {
    const response: SubscriptionResponse = await this._fetch({ headers: { userAddress: user } })
    const { status, content } = response

    if (status !== NOTIFIER_RESPONSE_STATUSES.OK) {
      this.errorReporter({
        error: new Error('Subscription fetch Error'),
        text: 'Error getting pending subscription',
        id: 'service-fetch',
      })
    }
    return content
  }

  getActiveSubscription =
  async (user: string):
  Promise<SubscriptionDTO|undefined> => {
    const userSubscriptions: Array<SubscriptionDTO> = await this.getUserSubscriptions(user)
    return this._getActiveSubscriptionFrom(userSubscriptions)
  }

  _getActiveSubscriptionFrom = (userSubscriptions: Array<SubscriptionDTO>): SubscriptionDTO|undefined => {
    const activeSubscriptions: Array<SubscriptionDTO> = userSubscriptions.filter((subscription) => {
      const { status: subscriptionStatus } = subscription
      //  when there will be notifier support for multiple active subscriptions add planId to condition
      return subscriptionStatus === 'ACTIVE'
    })

    if (activeSubscriptions.length) {
      return activeSubscriptions[0]
    }
    return undefined
  }

  getPendingSubscription =
  async (user: string, planId: number):
  Promise<SubscriptionSummary|undefined> => {
    const userSubscriptions: Array<SubscriptionDTO> = await this.getUserSubscriptions(user)

    if (this._getActiveSubscriptionFrom(userSubscriptions)) {
      throw new CustomError('User already has an active subscription')
    }

    const pendingSubscriptions: Array<SubscriptionDTO> = userSubscriptions.filter((subscription) => {
      const { subscriptionPlanId, status: subscriptionStatus } = subscription
      return subscriptionPlanId === planId && (subscriptionStatus === 'PENDING')
    })

    if (pendingSubscriptions.length) {
      return pendingSubscriptions[0]
    }
    return undefined
  }
}

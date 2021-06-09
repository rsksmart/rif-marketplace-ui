import { SubscriptionPlanResponse } from 'api/rif-notifier-service/models/subscriptionPlan'
import { NOTIFIER_RESPONSE_STATUSES } from 'api/rif-notifier-service/models/response'
import { NotifierAPIService } from './interfaces'

export const address = 'getSubscriptionPlans' as const
export type Address = typeof address

export default class SubscriptionPlans
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<SubscriptionPlanResponse> => this.service.find()

  hasPlans = async (): Promise<boolean> => {
    const { status, content: { length } }: SubscriptionPlanResponse = await this.fetch()
    const isValidResponse = status === NOTIFIER_RESPONSE_STATUSES.OK

    if (isValidResponse && !length) {
      this.errorReporter({
        error: new Error('No available subscription plan'),
        text: 'At least one subscription plan must be available for registration',
        id: 'service-fetch',
      })
      return false
    }
    return isValidResponse
  }
}

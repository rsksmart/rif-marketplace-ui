import { NOTIFIER_RESPONSE_MESSAGES } from 'api/rif-notifier-service/responseConstants'
import { SubscriptionResponse } from 'api/rif-notifier-service/models/subscriptionPlan'
import { NotifierAPIService } from './interfaces'

export const address = 'getSubscriptionPlans' as const
export type Address = typeof address

export default class SubscriptionPlans
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<SubscriptionResponse> => this.service.find()

  hasPlans = ({ content: { length }, message }: SubscriptionResponse): boolean => {
    const validResponse = message === NOTIFIER_RESPONSE_MESSAGES.OK

    if (validResponse && !length) {
      this.errorReporter({
        error: new Error('No available subscription plan'),
        text: 'Atleast one subscription plan must be available for registration',
        id: 'service-fetch',
      })
      return false
    }
    return validResponse
  }
}

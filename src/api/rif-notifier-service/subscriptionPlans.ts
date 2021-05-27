import { NotifierAPIService } from './interfaces'
import { SubscriptionPlanDTO } from './models/subscriptionPlan'

export const address = 'getSubscriptionPlans' as const
export type Address = typeof address

export default class SubscriptionPlans
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<Array<SubscriptionPlanDTO>> => this.service.find()

  hasPlans = async (): Promise<boolean> => {
    const plans = await this._fetch()
      .catch(() => {
        this.errorReporter({
          error: new Error('No available subscription plan'),
          text: 'Atleast one subscription plan must be available for registration',
          id: 'service-fetch',
        })
        return []
      })
    return Boolean(plans.length)
  }
}

import { SubscriptionPlanDTO, SubscriptionPlanResponse } from 'api/rif-notifier-service/models/subscriptionPlan'
import { NOTIFIER_RESPONSE_STATUSES } from 'api/rif-notifier-service/models/response'
import { logNotImplemented } from 'utils/utils'
import { NotifierAPIService } from './interfaces'

export const address = 'getSubscriptionPlans?activePlansOnly=true' as const
export type Address = typeof address

export default class SubscriptionPlans
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<SubscriptionPlanResponse> => this.service.find()

  getActivePlans = async (): Promise<Array<SubscriptionPlanDTO>> => {
    const { status, content }: SubscriptionPlanResponse = await this.fetch()

    if (status === NOTIFIER_RESPONSE_STATUSES.OK) return content

    this.errorReporter({
      id: 'service-fetch',
      text: 'Wrong response from notifier provider',
      error: new Error(`Wrong response from notifier provider ${JSON.stringify(content)}`),
    })
    return []
  }

  _create = (): Promise<any> => Promise.resolve(logNotImplemented('Subscription Plans')())
}

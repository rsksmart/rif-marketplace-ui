import { SubscriptionPlanResponse } from 'api/rif-notifier-service/models/subscriptionPlan'
import { NOTIFIER_RESPONSE_STATUSES } from 'api/rif-notifier-service/models/response'
import { logNotImplemented } from 'utils/utils'
import { NotifierAPIService } from './interfaces'

export const address = 'getSubscriptionPlans' as const
export type Address = typeof address

export default class SubscriptionPlans
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<SubscriptionPlanResponse> => this.service.find()

  hasActivePlans = async (): Promise<boolean> => {
    const { status, content }: SubscriptionPlanResponse = await this.fetch()
    const isValidResponse = status === NOTIFIER_RESPONSE_STATUSES.OK

    const anyActive = content.some(({ planStatus }) => planStatus === 'ACTIVE')

    return isValidResponse && anyActive
  }

  _create = (): Promise<any> => Promise.resolve(logNotImplemented('Subscription Plans')())
}

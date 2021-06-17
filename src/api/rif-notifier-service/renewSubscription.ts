import { logNotImplemented } from 'utils/utils'
import { NotifierAPIService, NotifierResponse } from './interfaces'
import { NOTIFIER_RESPONSE_STATUSES } from './models/response'
import { SubscribeToPlanDTO, SubscribeToPlanResponseDTO } from './models/subscriptions'

type SubscribeToPlanResponse = NotifierResponse<SubscribeToPlanResponseDTO>

export const address = 'renewSubscription' as const
export default class RenewSubscriptionService
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<void> => Promise.resolve(logNotImplemented('find')())

  _create = <SubscribeToPlanDTO, SubscribeToPlanResponse>
    (
      subscriptionData: SubscribeToPlanDTO,
      query,
  ):
    Promise<SubscribeToPlanResponse> => this.service.create(subscriptionData, query)

  renewSubscription = async (
    subscriptionData: SubscribeToPlanDTO,
    previousSubscriptionHash: string,
  ):
    Promise<SubscribeToPlanResponseDTO> => {
    const query = { previousSubscriptionHash }

    const response: SubscribeToPlanResponse = await this.create(
      subscriptionData, { query },
    )
    const { status, content } = response

    if (status !== NOTIFIER_RESPONSE_STATUSES.OK) {
      this.errorReporter({
        error: new Error('Subscription Renew Error'),
        text: 'Error renewing subscription',
        id: 'service-post',
      })
    }
    return content
  }
}

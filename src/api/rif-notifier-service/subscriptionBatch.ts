import { NotifierAPIService, NotifierResponse } from './interfaces'
import { NOTIFIER_RESPONSE_STATUSES } from './models/response'
import { SubscribeToPlanDTO, SubscribeToPlanResponseDTO } from './models/subscriptions'

type SubscribeToPlanResponse = NotifierResponse<SubscribeToPlanResponseDTO>

export const address = 'subscribeToPlan' as const
export default class SubscribeToPlanService
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<SubscribeToPlanResponseDTO> => this.service.find()

  _create =
    <SubscribeToPlanDTO, SubscribeToPlanResponse>
    (subscriptionData: SubscribeToPlanDTO):
    Promise<SubscribeToPlanResponse> => this.service.create(subscriptionData)

  subscribeToPlan =
  async (subscriptionData: SubscribeToPlanDTO):
  Promise<SubscribeToPlanResponseDTO> => {
    const response: SubscribeToPlanResponse = await this.create(subscriptionData)
    const { status, content } = response

    if (status !== NOTIFIER_RESPONSE_STATUSES.OK) {
      this.errorReporter({
        error: new Error('Subscription Creation Error'),
        text: 'Error Creating new subscription',
        id: 'service-fetch',
      })
    }
    return content
  }
}

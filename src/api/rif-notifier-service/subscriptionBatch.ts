import { NotifierAPIService, NotifierResponse } from './interfaces'
import { SubscribeToPlanDTO, SubscribeToPlanResponseDTO } from './models/subscriptions'

export const address = 'subscribeToPlan' as const
export default class SubscribeToPlanService
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<SubscribeToPlanResponseDTO> => this.service.find()

  _create = async <SubscribeToPlanDTO>(subscriptionData: SubscribeToPlanDTO): Promise<SubscribeToPlanResponseDTO> => {
    const { content }: NotifierResponse<SubscribeToPlanResponseDTO> = await this.service.create(subscriptionData)
    return content
  }

  subscribeToPlan = async <SubscribeToPlanDTO, SubscribeToPlanResponseDTO>
  (subscriptionData: SubscribeToPlanDTO): Promise<SubscribeToPlanResponseDTO> => {
    const content = await this.create(subscriptionData).catch((error) => {
      this.errorReporter({ error: new Error(error), text: 'Error Creating new subscription', id: 'service-fetch' })
    })
    return content
  }
}

import { NotifierAPIService, NotifierResponse } from './interfaces'
import { SubscribeToPlanDTO, SubscribeToPlanResponseDTO } from './models/subscriptions'

export const address = 'subscribeToPlan' as const
export default class SubscribeToPlanService
  extends NotifierAPIService {
  path = address

  _fetch = (): Promise<SubscribeToPlanResponseDTO> => this.service.find()

  subscribeToPlan = async (subscriptionData: SubscribeToPlanDTO): Promise<SubscribeToPlanResponseDTO> => {
    const { content }: NotifierResponse<SubscribeToPlanResponseDTO> = await this.create(subscriptionData)
    return content
  }
}

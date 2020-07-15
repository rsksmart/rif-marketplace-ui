import { AbstractAPIService, APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'
import utils from './utils'

export type ConfirmationAddress = 'confirmations'
export const confirmationAddress: ConfirmationAddress = 'confirmations'

export type ConfirmationAPI = Modify<APIService, {
  path: ConfirmationAddress
}>

export interface ConfirmationsItem {
  currentCount: number
  targetCount: number
}

export type Confirmations = Record<string, ConfirmationsItem>

export interface ConfirmationsTransportItem {
  transactionHash: string
  confirmations: number
  targetConfirmation: number
  event: string
}
export class ConfirmationsService extends AbstractAPIService implements ConfirmationAPI {
  path = confirmationAddress

  _fetch = async (): Promise<Confirmations> => {
    const data = await this.service.find() as unknown as ConfirmationsTransportItem[]
    return utils.mapFromTransport(data)
  }
}
import { AbstractAPIService, APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'

export type ConfirmationAddress = 'confirmations'
const confirmationAddress: ConfirmationAddress = 'confirmations'

export type ConfirmationAPI = Modify<APIService, {
  path: ConfirmationAddress
}>

export interface ConfirmationsItem {
  currentCount: number
  targetCount: number
}

export type Confirmations = Record<string, ConfirmationsItem>

interface ConfirmationsTransportItem {
  transactionHash: string
  confirmations: number
  targetConfirmation: number
  event: string
}

/* eslint-disable no-param-reassign */
export const mapFromTransport = (data: ConfirmationsTransportItem[]): Confirmations => data.reduce((map, item: ConfirmationsTransportItem) => {
  map[item.transactionHash] = {
    currentCount: item.confirmations,
    targetCount: item.targetConfirmation,
  }
  return map
}, {})
/* eslint-enable no-param-reassign */

export class ConfirmationsService extends AbstractAPIService implements ConfirmationAPI {
  path = confirmationAddress

  protected _fetch = async (): Promise<Confirmations> => {
    const data = await this.service.find()
    return mapFromTransport(data)
  }
}

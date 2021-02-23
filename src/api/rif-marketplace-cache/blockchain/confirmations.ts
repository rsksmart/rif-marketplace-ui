import { Paginated } from '@feathersjs/feathers'
import {
  AbstractAPIService, APIService, isResultPaginated,
} from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'
import client from '../client'
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

export interface Transport {
  transactionHash: string
  confirmations: number
  targetConfirmation: number
  event: string
}

export class ConfirmationsService
  extends AbstractAPIService
  implements ConfirmationAPI {
  path = confirmationAddress

  constructor () { super(client) }

  _fetch = async (): Promise<Confirmations> => {
    const result: Paginated<Transport> = await this
      .service.find()
    const { data, ...metadata } = isResultPaginated(result)
      ? result
: { data: result }
    this.meta = metadata

    return utils.mapFromTransport(data)
  }
}

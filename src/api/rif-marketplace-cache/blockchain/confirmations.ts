import { Paginated } from '@feathersjs/feathers'
import {
  AbstractAPIService, APIService, isResultPaginated, PaginatedResult,
} from 'api/models/apiService'
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

interface Transport {
  transactionHash: string
  confirmations: number
  targetConfirmation: number
  event: string
}

/* eslint-disable no-param-reassign */
export const mapFromTransport = (data: Transport[]): Confirmations => data
  .reduce((map, item: Transport) => {
    map[item.transactionHash] = {
      currentCount: item.confirmations,
      targetCount: item.targetConfirmation,
    }
    return map
  }, {})
/* eslint-enable no-param-reassign */

export class ConfirmationsService
  extends AbstractAPIService
  implements ConfirmationAPI {
  path = confirmationAddress

  _fetch = async (): Promise<Confirmations> => {
    const result: Paginated<Transport> = await this.service.find()
    const data: Transport[] = isResultPaginated(result)
      ? result.data : result

    return mapFromTransport(data)
  }
}

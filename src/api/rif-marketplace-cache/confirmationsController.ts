import { Application, Service } from '@feathersjs/feathers'
import { APIController, ServiceEventListener } from 'store/App/AppStore'

type Modify<T, R> = Omit<T, keyof R> & R;

export type ConfirmationAPI = APIController

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

export class ConfirmationsController implements ConfirmationAPI {
  path = '/confirmations'

  service!: Service<any>

  connect = (client: Application<any>) => {
    try {
      this.service = client.service(this.path)
      return this.path
    } catch (e) {
      return undefined
    }
  }

  fetch = async (): Promise<Confirmations> => {
    if (!this.service) throw Error('The confirmations service is not connected')

    const data = await this.service.find()

    return mapFromTransport(data)
  }

  attachEvent = (name: string, callback: ServiceEventListener) => {
    if (this.service) this.service.on(name, callback)
  }

  detachEvent = (name: string) => name
}

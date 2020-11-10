import { Paginated } from '@feathersjs/feathers'
import {
  AbstractAPIService, isResultPaginated, MapFromTransport,
} from 'api/models/apiService'
import { Big } from 'big.js'
import { Transport, NotificationItem, NotificationsAPI } from './interfaces'

export const serviceAddress = 'notification' as const
export const serviceChannel = 'notifications' as const

export const mapFromTransport: MapFromTransport<
  Transport,
  NotificationItem
> = (transport) => ({
  ...transport,
  payload: {
    ...transport.payload,
    expectedSize: Big(transport.payload.expectedSize),
    size: Big(transport.payload.size),
    timestamp: parseInt(transport.payload.timestamp, 10),
  },
})

export class NotificationsService
  extends AbstractAPIService
  implements NotificationsAPI {
  path = serviceAddress

  _fetch = async (): Promise<NotificationItem[]> => {
    const result: Paginated<Transport> = await this.service.find()
    const { data, ...metadata } = isResultPaginated(result)
      ? result : { data: result }
    this.meta = metadata

    return data.map(mapFromTransport)
  }
}

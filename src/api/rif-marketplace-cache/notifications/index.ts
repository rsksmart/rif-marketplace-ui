import { Paginated } from '@feathersjs/feathers'
import {
  AbstractAPIService, isResultPaginated,
} from 'api/models/apiService'
import { NotificationsAPI, NotificationsItem } from './interfaces'

export const serviceAddress = 'notification' as const
export const serviceChannel = 'notifications' as const

export class NotificationsService
  extends AbstractAPIService
  implements NotificationsAPI {
  path = serviceAddress

  _fetch = async (): Promise<NotificationsItem[]> => {
    const result: Paginated<Transport> = await this
      .service.find()
    const { data, ...metadata } = isResultPaginated(result)
      ? result : { data: result }
    this.meta = metadata

    return data as unknown as NotificationsItem[] // .map(utils.mapFromTransport)
  }
}

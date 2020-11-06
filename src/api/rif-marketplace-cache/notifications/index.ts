import { Paginated } from '@feathersjs/feathers'
import {
  AbstractAPIService, isResultPaginated,
} from 'api/models/apiService'
import { NotificationItem, NotificationsAPI } from './interfaces'

export const serviceAddress = 'notification' as const
export const serviceChannel = 'notifications' as const

export class NotificationsService
  extends AbstractAPIService
  implements NotificationsAPI {
  path = serviceAddress

  _fetch = async (): Promise<NotificationItem[]> => {
    const result: Paginated<NotificationItem> = await this
      .service.find()
    const { data, ...metadata } = isResultPaginated(result)
      ? result : { data: result }
    this.meta = metadata

    return data
  }
}

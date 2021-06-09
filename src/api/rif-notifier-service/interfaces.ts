import { Params } from '@feathersjs/feathers'
import { createRestClient } from 'api/client'
import { AbstractAPIService } from 'api/models/apiService'
import { NOTIFIER_RESPONSE_STATUSES, NotifierResponseStatus } from 'api/rif-notifier-service/models/response'

export type NotifierResponse<T> = {
  content: T
  message: string
  status: NotifierResponseStatus
}
export type ServiceAddress = string
export abstract class NotifierAPIService extends AbstractAPIService {
  path: ServiceAddress

  constructor(url: string) {
    super(createRestClient<NotifierAPIService>(url))
    this.path = url
  }

  fetch = <T>(): Promise<NotifierResponse<T>> => this._fetch()
    .catch((error) => {
      this.errorReporter({
        error,
        text: 'Error fetching data from notifier',
        id: 'service-fetch',
      })
      return { content: [], message: NOTIFIER_RESPONSE_STATUSES.ERROR }
    })

  create = <T, R>(data: T, params?: Params): Promise<NotifierResponse<R>> => this.service.create(data, params)
    .catch((error) => {
      this.errorReporter({
        error,
        text: 'Error creating notifier resource',
        id: 'service-fetch',
      })
      return { content: [], status: NOTIFIER_RESPONSE_STATUSES.ERROR, message: error }
    })
}

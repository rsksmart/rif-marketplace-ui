import { createRestClient } from 'api/client'
import AbstractRestAPIService from 'api/models/restAPIService'
import { NOTIFIER_RESPONSE_STATUSES, NotifierResponseStatus } from 'api/rif-notifier-service/models/response'

export type NotifierResponse<T> = {
  content: T
  message: string
  status: NotifierResponseStatus
}
export type ServiceAddress = string
export abstract class NotifierAPIService extends AbstractRestAPIService {
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
}

import { createRestClient } from 'api/client'
import { AbstractAPIService } from 'api/models/apiService'
import { NOTIFIER_RESPONSE_MESSAGES, NotifierResponseMessage } from 'api/rif-notifier-service/models/response'

export type NotifierResponse = {
  content: Array<any>
  message: NotifierResponseMessage
}
export type ServiceAddress = string
export abstract class NotifierAPIService extends AbstractAPIService {
  path: ServiceAddress

  constructor(url: string) {
    super(createRestClient<NotifierAPIService>(url))
    this.path = url
  }

  fetch = (): Promise<NotifierResponse> => this._fetch()
    .catch((error) => {
      this.errorReporter({
        error,
        text: 'Error fetching data from notifier',
        id: 'service-fetch',
      })
      return { content: [], message: NOTIFIER_RESPONSE_MESSAGES.ERROR }
    })
}

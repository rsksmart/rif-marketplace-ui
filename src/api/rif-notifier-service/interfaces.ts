import { createRestClient } from 'api/client'
import { AbstractAPIService } from 'api/models/apiService'

export type ServiceAddress = string
export abstract class NotifierAPIService extends AbstractAPIService {
  path: ServiceAddress

  constructor(url: string) {
    super(createRestClient<NotifierAPIService>(url))
    this.path = url
  }
}

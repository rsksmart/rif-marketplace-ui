import { createRestClient } from 'api/client'
import { AbstractAPIService } from 'api/models/apiService'
import { UIError } from 'models/UIMessage'
import { NotifierAPIService, Subscriptions } from './interfaces'

const API_ADDRESSES = {
  GET_SUBSCRIPTIONS: 'getSubscriptions',
  GET_SUBSCRIPTION_INFO: 'getSubscriptionInfo',
}

export default class NotifierService
  extends AbstractAPIService
  implements NotifierAPIService {
  constructor(url: string) {
    super(createRestClient<NotifierAPIService>(url))
    this.path = url
  }

    getSubscriptions = async (account: string): Promise<Subscriptions[]> => {
      const response = await fetch(`${this.path}/${API_ADDRESSES.GET_SUBSCRIPTIONS}`)

      if (response.status !== 200) {
        throw new UIError({
          error: new Error(await response.json()),
          text: `Error: Could not get subscriptions for account ${account}`,
          id: 'service-fetch',
        })
      }

      return response.json()
    }

   getSubscriptionInfo = async (subscriptionId: string):
   Promise<Subscriptions[]> => {
     const response = await fetch(`${this.path}/${API_ADDRESSES.GET_SUBSCRIPTION_INFO}`)

     if (response.status !== 200) {
       throw new UIError({
         error: new Error(await response.json()),
         text: `Error: Could not get subscription with id ${subscriptionId}`,
         id: 'service-fetch',
       })
     }

     return response.json()
   }

    _fetch = (): Promise<void> => Promise.resolve()
}

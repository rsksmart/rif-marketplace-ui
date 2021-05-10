import { createRestClient } from 'api/client'
import { AbstractAPIService } from 'api/models/apiService'
import { UIError } from 'models/UIMessage'
import { NotifierAPIService, Subscriptions } from './interfaces'

const END_POINTS = {
  GET_SUBSCRIPTIONS: 'getSubscriptions',
  GET_SUBSCRIPTION_INFO: 'getSubscriptionInfo',
  AUTH: 'users',
}

export default class NotifierService
  extends AbstractAPIService
  implements NotifierAPIService {
    apiKey = ''

    userAddress = ''

    constructor(url: string) {
      super(createRestClient<NotifierAPIService>(url))
      this.path = url
    }

    isAuthorized = () => Boolean(this.apiKey)

    auth = async (address: string): Promise<void> => {
      const url = `${this.path}/${END_POINTS.AUTH}?address=${address}`
      const response = await fetch(url, {
        method: 'POST',
      })

      if (response.status !== 200) {
        throw new UIError({
          error: new Error(await response.json()),
          text: `NotifierService ${this.path}: Authentication failed for user ${address}`,
          id: 'service-fetch',
        })
      }

      const {
        status,
        content: {
          apiKey,
        },
      } = await response.json()

      if (status !== 'OK') {
        throw new UIError({
          error: new Error(await response.json()),
          text: `Error: Auth error for address ${address}`,
          id: 'service-fetch',
        })
      }

      this.userAddress = address
      this.apiKey = apiKey
    }

    getSubscriptions = async (account: string): Promise<Subscriptions[]> => {
      if (!this.apiKey) {
        await this.auth(account)
      }

      const response = await fetch(
        `${this.path}/${END_POINTS.GET_SUBSCRIPTIONS}`,
        {
          headers: {
            userAddress: account,
          },
        },
      )

      if (response.status !== 200) {
        throw new UIError({
          error: new Error(await response.json()),
          text: `NotifierService: Could not get subscriptions for account ${account}`,
          id: 'service-fetch',
        })
      }

      const {
        content,
        message,
      } = await response.json()

      if (message !== 'OK') {
        throw new UIError({
          error: new Error(await response.json()),
          text: `NotifierService: Could not get subscriptions for account ${account}`,
          id: 'service-fetch',
        })
      }

      return content
    }

   getSubscriptionInfo = async (subscriptionId: string):
   Promise<Subscriptions[]> => {
     const response = await fetch(`${this.path}/${END_POINTS.GET_SUBSCRIPTION_INFO}`)

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

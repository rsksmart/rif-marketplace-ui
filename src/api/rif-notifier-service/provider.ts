import { UIError } from 'models/UIMessage'
import { API_RESPONSE_MESSAGES } from 'constants/strings'
import NotifierService from 'api/rif-notifier-service/index'

const END_POINTS = {
  GET_SUBSCRIPTION_PLANS: 'getSubscriptionPlans',
}
export default class ProviderValidationService extends NotifierService {
  healthCheck = async (): Promise<string> => {
    const url = `${this.path}/${END_POINTS.GET_SUBSCRIPTION_PLANS}`
    const response = await fetch(url, {
      method: 'GET',
    })

    if (response.status === 200) {
      const { message, content } = await response.json()

      if (content.length) return message
      throw new UIError({
        error: new Error('No available subscription plan'),
        text: 'Atleast one subscription plan must be available for registration',
        id: 'service-fetch',
      })
    }
    return API_RESPONSE_MESSAGES.ERROR
  }
}

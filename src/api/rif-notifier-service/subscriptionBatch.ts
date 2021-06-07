import { UIError } from 'models/UIMessage'
import { NotifierResponse } from './interfaces'
import { NOTIFIER_RESPONSE_STATUSES } from './models/response'
import { SubscribeToPlanDTO, SubscribeToPlanResponseDTO } from './models/subscriptions'

const NOTIFIER_API_ENDPOINTS = {
  SUBSCRIBE_TO_PLAN: 'subscribeToPlan',
}

export const subscribeToPlan = async (
  providerUrl: string,
  subscriptionData: SubscribeToPlanDTO,
): Promise<SubscribeToPlanResponseDTO> => {
  const options = {
    method: 'POST',
    host: providerUrl,
    path: `/${NOTIFIER_API_ENDPOINTS.SUBSCRIBE_TO_PLAN}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscriptionData),
  }

  const response = await fetch(
    `${providerUrl}/${NOTIFIER_API_ENDPOINTS.SUBSCRIBE_TO_PLAN}`,
    options,
  )

  const jsonResponse = await response.json()
  const {
    content, message,
  } = jsonResponse as NotifierResponse<SubscribeToPlanResponseDTO>

  if (response.status !== 200 || message !== NOTIFIER_RESPONSE_STATUSES.OK) {
    throw new UIError({
      error: new Error(message),
      text: 'Error: Could not subscribe to plan:',
      id: 'service-post',
    })
  }

  return content
}

export default {
  subscribeToPlan,
}

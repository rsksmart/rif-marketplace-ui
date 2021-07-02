import {
  NotificationPreference, TopicDTO, TOPIC_TYPES, TopicParams, TOPIC_PARAM_TYPES, SubscribeToPlanDTO, NotificationServiceType, SubscribeToPlanResponseDTO,
} from 'api/rif-notifier-service/models/subscriptions'
import SubscribeToPlanService from 'api/rif-notifier-service/subscriptionBatch'
import SubscriptionService, { SubscriptionSummary } from 'api/rif-notifier-service/subscriptionService'
import { SupportedEventType } from 'config/notifier'
import { OrderItem } from 'context/Services/notifier/offers/interfaces'
import { NotifierEventItem } from 'models/marketItems/NotifierEventItem'
import { NotifierChannel } from 'models/marketItems/NotifierItem'
import { SupportedTokenSymbol } from 'models/Token'
import { UIError } from 'models/UIMessage'
import { convertToWeiString } from 'utils/parsers'

const buildBlockEvent = (
  notificationPreferences: Array<NotificationPreference>,
): TopicDTO => ({
  type: TOPIC_TYPES.NEW_BLOCK,
  notificationPreferences,
  topicParams: [],
})

const buildContractEvent = (
  notificationPreferences: Array<NotificationPreference>,
  { event: { smartContract, name, params } }: NotifierEventItem,
): TopicDTO => {
  const topicParams: Array<TopicParams> = [
    {
      type: TOPIC_PARAM_TYPES.CONTRACT_ADDRESS,
      value: smartContract as string,
    },
    {
      type: TOPIC_PARAM_TYPES.EVENT_NAME,
      value: name as string,
    },
  ]

  if (params) {
    params.forEach(({
      type: valueType,
      name: paramName,
      indexed: paramIsIndexed,
    }) => {
      const topicParam: TopicParams = {
        type: TOPIC_PARAM_TYPES.EVENT_PARAM,
        value: paramName,
        indexed: paramIsIndexed,
        valueType: valueType.charAt(0).toUpperCase() + valueType.slice(1),
      }
      topicParams.push(topicParam)
    })
  }

  return {
    type: TOPIC_TYPES.CONTRACT_EVENT,
    notificationPreferences,
    topicParams,
  } as TopicDTO
}

const eventBuilders: Record<SupportedEventType, Function> = {
  NEWBLOCK: buildBlockEvent,
  SMARTCONTRACT: buildContractEvent,
}

export const buildTopicsDTOFrom = (
  notifierEventItems: Array<NotifierEventItem>,
): Array<TopicDTO> => {
  const topics: Array<TopicDTO> = []
  notifierEventItems.forEach((notifierEventItem) => {
    const {
      event: { type: eventType, channels },
    } = notifierEventItem
    const notificationPreferences: Array<NotificationPreference> = channels.map(
      (channel: NotifierChannel) => ({
        notificationService: channel.type as NotificationServiceType,
        destination: channel.destination,
        destinationParams: {
          username: '',
          password: '',
          apiKey: '',
        },
      }),
    )

    topics.push(
      eventBuilders[eventType](notificationPreferences, notifierEventItem),
    )
  })
  return topics
}

type SubscriptionOrderItem = Pick<OrderItem, 'url' | 'planId' | 'value'> & {
  symbol: SupportedTokenSymbol
}

export const buildSubscribeToPlanDTO = (
  item: SubscriptionOrderItem,
  topics: Array<TopicDTO>,
  account: string,
): SubscribeToPlanDTO => {
  const {
    symbol: currencySymbol,
    planId: subscriptionPlanId,
    value: price,
  } = item

  return {
    subscriptionPlanId: Number(subscriptionPlanId),
    userAddress: account,
    price: convertToWeiString(price),
    currency: currencySymbol,
    topics,
  }
}

export const searchPendingSubscription = (
  account: string,
  item: SubscriptionOrderItem,
  reportError: (e: UIError) => void,
): Promise<SubscriptionSummary | undefined> => {
  const { url: providerUrl, planId } = item
  const subscriptionService = new SubscriptionService(providerUrl)
  subscriptionService.connect(reportError)
  return subscriptionService.getPendingSubscription(account, planId)
}

export const createPendingSubscription = (
  item: SubscriptionOrderItem,
  notifierEventItems: Array<NotifierEventItem>,
  account: string, reportError: (e: UIError) => void,
): Promise<SubscribeToPlanResponseDTO> => {
  const { url: providerUrl } = item
  const subscribeToPlanDTO = buildSubscribeToPlanDTO(
    item, buildTopicsDTOFrom(notifierEventItems), account,
  )

  const subscribeToPlanService = new SubscribeToPlanService(providerUrl)
  subscribeToPlanService.connect(reportError)

  return subscribeToPlanService.subscribeToPlan(subscribeToPlanDTO)
}

export const getOrCreateSubscription = async (item: SubscriptionOrderItem,
  eventsAdded: Array<NotifierEventItem>, account: string,
  reportError: (e: UIError) => void): Promise<SubscriptionSummary> => {
  const pendingSubscription = await searchPendingSubscription(
    account, item, reportError,
  )

  if (pendingSubscription) {
    return pendingSubscription
  }
  const {
    signature, hash,
  } = await createPendingSubscription(item, eventsAdded, account, reportError)
  return {
    signature, hash, status: 'PENDING',
  }
}

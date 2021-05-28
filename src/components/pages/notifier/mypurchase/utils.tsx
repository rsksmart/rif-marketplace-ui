import React from 'react'
import {
  EventParam, EVENT_PARAM_TYPES, SubscriptionEvent, TopicParamType,
} from 'api/rif-marketplace-cache/notifier/subscriptions/models'
import MarketplaceCell from 'components/atoms/MarketplaceCell'
import { SubscriptionEventsDisplayItem } from 'components/organisms/notifier/mypurchase/NotifierDetailsModal'
import RifAddress from 'components/molecules/RifAddress'

export const getTopicParamValue = (
  topicParams: Array<EventParam>,
  paramType: TopicParamType,
): string => topicParams.find(
  ({ type }) => type === paramType,
)?.value || ''

export const eventDisplayItemIterator = ({
  notificationPreferences, topicParams, type: eventType,
}: SubscriptionEvent): SubscriptionEventsDisplayItem => {
  const nameValue = getTopicParamValue(
    topicParams, EVENT_PARAM_TYPES.EVENT_NAME,
  )
  const name = (
    <MarketplaceCell>
      {nameValue || eventType}
    </MarketplaceCell>
  )
  const contractAddress = getTopicParamValue(
    topicParams, EVENT_PARAM_TYPES.CONTRACT_ADDRESS,
  )
  const contract = contractAddress ? (
    <RifAddress
      color="textSecondary"
      variant="body2"
      value={contractAddress}
    />
  ) : <MarketplaceCell>N/A</MarketplaceCell>

  const channels = (
    <MarketplaceCell>
      {Array.isArray(notificationPreferences)
        ? notificationPreferences.join(', ')
        : notificationPreferences}
    </MarketplaceCell>
  )

  const type = (
    <MarketplaceCell>
      {eventType}
    </MarketplaceCell>
  )

  return ({
    channels,
    id: `${name}.${contract}`,
    name,
    contract,
    type,
  })
}

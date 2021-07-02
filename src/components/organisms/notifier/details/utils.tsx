import React from 'react'
import {
  EVENT_PARAM_TYPES, TopicParamType,
} from 'api/rif-marketplace-cache/notifier/subscriptions/models'
import MarketplaceCell from 'components/atoms/MarketplaceCell'
import RifAddress from 'components/molecules/RifAddress'
import { TopicDTO, TopicParams } from 'api/rif-notifier-service/models/subscriptions'
import { SubscriptionEventsDisplayItem } from './NotifierDetailsModal'

export const getTopicParamValue = (
  topicParams: Array<TopicParams>,
  paramType: TopicParamType,
): string => topicParams.find(
  ({ type }) => type === paramType,
)?.value || ''

export const eventDisplayItemIterator = ({
  notificationPreferences, topicParams, type: eventType,
}: TopicDTO): SubscriptionEventsDisplayItem => {
  const nameValue = topicParams && getTopicParamValue(
    topicParams, EVENT_PARAM_TYPES.EVENT_NAME,
  )
  const name = (
    <MarketplaceCell>
      {nameValue || eventType}
    </MarketplaceCell>
  )
  const contractAddress = topicParams && getTopicParamValue(
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
    id: `${name}@${contractAddress}`,
    name,
    contract,
    type,
  })
}

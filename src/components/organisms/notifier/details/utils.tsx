import React from 'react'
import {
  EVENT_PARAM_TYPES, TopicDTO, TopicParams, TopicParamType,
} from 'api/rif-marketplace-cache/notifier/subscriptions/models'
import MarketplaceCell from 'components/atoms/MarketplaceCell'
import RifAddress from 'components/molecules/RifAddress'
import { EventChannel, EventChannels } from 'models/marketItems/NotifierItem'
import Grid from '@material-ui/core/Grid'
import { SubscriptionEventsDisplayItem } from './NotifierDetailsModal'

export const getTopicParamValue = (
  topicParams: Array<TopicParams>,
  paramType: TopicParamType,
): string => topicParams.find(
  ({ type }) => type === paramType,
)?.value || ''

export const eventDisplayItemIterator = ({
  notificationPreferences, topicParams, type: eventType,
}: TopicDTO, channels: EventChannels = []): SubscriptionEventsDisplayItem => {
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
  const cleanPrefs = Array.isArray(notificationPreferences)
    ? Array.from(new Set(notificationPreferences))
    : [notificationPreferences]

  const channelsCell = channels.length ? (
    <MarketplaceCell>
      <Grid container direction="column">
        {cleanPrefs.map((channelType) => {
          const channel = channels.find(
            ({ type }) => type === channelType,
          ) as EventChannel
          return (
            <Grid item key={channelType}>
              {`${channelType} from ${channel.origin}`}
            </Grid>
          )
        })}
      </Grid>
    </MarketplaceCell>
  ) : <MarketplaceCell>-</MarketplaceCell>

  const type = (
    <MarketplaceCell>
      {eventType}
    </MarketplaceCell>
  )

  return ({
    channels: channelsCell,
    id: `${name}@${contractAddress}`,
    name,
    contract,
    type,
  })
}

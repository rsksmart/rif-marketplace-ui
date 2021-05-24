/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, makeStyles, Typography,
} from '@material-ui/core'
import React, {
  FC, useState,
} from 'react'
import { createStyles, Theme } from '@material-ui/core/styles'
import { NotifierChannel } from 'models/marketItems/NotifierItem'
import NotificationChannel from 'components/organisms/notifier/NotificationChannel'
import { colors } from '@rsksmart/rif-ui'
import NotificationChannelCreate from 'components/organisms/notifier/NotificationChannelCreate'
import { SupportedEventChannel, SUPPORTED_EVENT_CHANNELS } from 'config/notifier'

const useStyles = makeStyles((theme: Theme) => createStyles({

  channelsList: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(15),
    borderTop: `1px solid ${colors.gray3}`,
    padding: theme.spacing(3, 0),
  },
}))

type Props = {
  channels?: Array<SupportedEventChannel>
  onEventChannelsUpdate: (channels: Array<NotifierChannel>) => void
}

const NotificationChannelsList: FC<Props> = ({ channels, onEventChannelsUpdate }) => {
  const classes = useStyles()
  const [addedChannels, setAddedChannels] = useState<Array<NotifierChannel>>([])

  if (!channels) {
    return <Grid />
  }
  const availableChannels: Array<SupportedEventChannel> = channels.filter((channel) => SUPPORTED_EVENT_CHANNELS.includes(channel as SupportedEventChannel))

  const addChannel = (notifierChannel: NotifierChannel) => {
    const newChannels = addedChannels.filter(({ type }) => type !== notifierChannel.type)
    newChannels.push(notifierChannel)
    setAddedChannels(newChannels)
    onEventChannelsUpdate(newChannels)
  }

  const removeChannel = (event): void => {
    const newChannels = addedChannels.filter((i) => i.type !== event.currentTarget.id)
    setAddedChannels(newChannels)
    onEventChannelsUpdate(newChannels)
  }

  const collection = addedChannels.map((channel) => ({
    type: channel.type,
    destination: channel.destination,
  }))

  return (availableChannels.length ? (
    <Grid>
      <Typography gutterBottom variant="h6" color="primary">
        Notification Channels
      </Typography>
      <Typography gutterBottom color="secondary" variant="body2">
        Select the channel that you want to receive your notification through
      </Typography>
      <NotificationChannelCreate
        availableChannels={availableChannels}
        channelAdd={addChannel}
      />
      <Grid className={classes.channelsList} item xs={12}>
        <Grid alignItems="center" container spacing={2}>
          {
                  collection.map((channel) => (
                    <NotificationChannel
                      channel={channel}
                      onRemoveClick={removeChannel}
                    />
                  ))
                }
        </Grid>
      </Grid>

    </Grid>
  ) : <Grid />
  )
}
export default NotificationChannelsList

/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, makeStyles, Typography,
} from '@material-ui/core'
import React, {
  FC, useState,
} from 'react'
import { createStyles, Theme } from '@material-ui/core/styles'
import { EventChannels, SelectedEventChannel, SelectedEventChannels } from 'models/marketItems/NotifierItem'
import NotificationChannel from 'components/organisms/notifier/NotificationChannel'
import { colors } from '@rsksmart/rif-ui'
import NotificationChannelCreate from 'components/organisms/notifier/NotificationChannelCreate'
import { SUPPORTED_EVENT_CHANNELS } from 'config/notifier'

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
  channels: EventChannels
  onEventChannelsUpdate: (channels: SelectedEventChannels) => void
}

const NotificationChannelsList: FC<Props> = ({
  channels, onEventChannelsUpdate,
}) => {
  const classes = useStyles()
  const [
    addedChannels,
    setAddedChannels,
  ] = useState<SelectedEventChannels>([])

  const availableChannels: EventChannels = channels.filter(
    (channel) => SUPPORTED_EVENT_CHANNELS.includes(channel.type),
  )

  const addChannel = (notifierChannel: SelectedEventChannel): void => {
    if (!addedChannels.find(({ type }) => type !== notifierChannel.type)) {
      setAddedChannels([...addedChannels, notifierChannel])
      onEventChannelsUpdate([...addedChannels, notifierChannel])
    }
  }

  const removeChannel = ({ currentTarget: { id: channelType } }): void => {
    const newChannels = addedChannels.filter((i) => i.type !== channelType)
    setAddedChannels(newChannels)
    onEventChannelsUpdate(newChannels)
  }

  const collection: SelectedEventChannels = addedChannels.map((channel) => ({
    ...channel,
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

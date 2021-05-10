/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, makeStyles, Typography,
} from '@material-ui/core'
import React, {
  FC, useState,
} from 'react'
import { createStyles, Theme } from '@material-ui/core/styles'
import { NotifierChannel, NotifierChannelType } from 'models/marketItems/NotifierItem'
import { validateEmail, validateURL } from 'utils/validationUtils'
import RoundBtn from 'components/atoms/RoundBtn'
import GridRow from 'components/atoms/GridRow'
import NotificationChannel from 'components/organisms/notifier/NotificationChannel'
import { colors } from '@rsksmart/rif-ui'
import NotificationChannelCreate from 'components/organisms/notifier/NotificationChannelCreate'

const useStyles = makeStyles((theme: Theme) => createStyles({

  channelsList: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(15),
    borderTop: `1px solid ${colors.gray3}`,
    padding: theme.spacing(3, 0),
  },
  notificationChannel: {
  },

}))

type Props =
    {
    channels: string[] | undefined
}

const NotificationChannelsList: FC<Props> = ({ channels }) => {
  const [notifierChannel, setChannel] = useState<NotifierChannel>({
    type: channels ? channels[0] : '',
    destination: '',
  })
  const [addedChannels, setChannels] = useState<Array<NotifierChannel>>([])
  const [destination, setDestination] = useState<string>('')
  const handleChange = (e) => {
    setChannel({
      type: e.target.value as string,
      destination: '',
    })
  }
  const classes = useStyles()

  if (!channels) {
    return <Grid />
  }
  const availableChannels: Array<string> = channels.map((ch) => (NotifierChannelType[ch] ? ch : ''))

  const validate = (channel: NotifierChannel) => {
    if (channel.destination) {
      if (channel.type === 'API') {
        return validateURL(channel.destination)
      }

      if (channel.type === 'EMAIL') {
        return validateEmail(channel.destination)
      }
    }
    return false
  }

  const addChannel = () => {
    notifierChannel.destination = destination

    if (!validate(notifierChannel)) {
      return
    }
    const index = addedChannels.findIndex((ch) => ch.type === notifierChannel.type)

    if (index === -1) addedChannels.push(notifierChannel)
    else addedChannels[index].destination = destination
    const newChannels = [...addedChannels]
    setChannels(newChannels)
  }

  const removeChannel = (e): void => {
    const newChannels = addedChannels.filter((i) => i.type !== e.currentTarget.id)
    setChannels(newChannels)
  }

  const collection = addedChannels.map((channel) => ({
    type: channel.type,
    destination: channel.destination,
  }))

  return (
    <Grid>
      <Typography gutterBottom variant="h6" color="primary">
        Notification Channels
      </Typography>
      <Typography gutterBottom color="secondary" variant="body2">
        Select the channel that you want to receive your notification through
      </Typography>
      <NotificationChannelCreate
        notifierChannel={notifierChannel}
        availableChannels={availableChannels}
        onDestinationChange={(e) => setDestination(e.currentTarget.value)}
        onChannelChange={handleChange}
        channelAdd={addChannel}
      />
      <Grid className={classes.channelsList} item xs={12}>
        <Grid alignItems="center" container spacing={2}>
          {
          collection.map((channel) => <NotificationChannel className={classes.notificationChannel} channel={channel} onRemoveClick={removeChannel} />)
        }
        </Grid>
      </Grid>
      <br />
      <br />
      <GridRow justify="center" spacing={2}>
        <RoundBtn type="submit">
          Submit
        </RoundBtn>
      </GridRow>
    </Grid>
  )
}
export default NotificationChannelsList

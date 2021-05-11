import React, {
  FC, useContext, useState,
} from 'react'

import {
  Grid, makeStyles,
  Typography,
} from '@material-ui/core'
import { NotifierOffersContextProps as ContextProps, NotifierOffersContext } from 'context/Services/notifier/offers'
import { Button } from '@rsksmart/rif-ui'
import Marketplace from 'components/templates/marketplace/Marketplace'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import NotifierPlanDescription from 'components/organisms/notifier/NotifierPlanDescription'
import MarketContext, { MarketContextProps } from 'context/Market'
import TableContainer from '@material-ui/core/TableContainer'
import { Item } from 'models/Market'
import RemoveButton from 'components/atoms/RemoveButton'
import Tooltip from '@material-ui/core/Tooltip'
import NotificationChannelsList from 'components/organisms/notifier/NotificationChannelsList'
import { createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({

  eventsSection: {
    marginTop: theme.spacing(4),
  },
}))

const eventHeaders = {
  name: 'Name',
  type: 'Type',
  channels: 'Channels',
  actions: '',
} as const

type EventItem = Item & {
  [K in keyof Omit<typeof eventHeaders, 'actions'>]: string
} & {
    signature: string
}

const NotifierOffersSelectedPage: FC = () => {
  const classes = useStyles()
  const {
    state: {
      exchangeRates: {
        currentFiat: {
          displayName: currentFiat,
        },
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)

  const {
    state: {
      order,
    },
    dispatch,
  } = useContext<ContextProps>(NotifierOffersContext)

  /* TODO use real events instead of hard coded events */
  const [events, setEvents] = useState<Array<EventItem>>(
    [
      {
        id: 'event1',
        name: 'event1',
        type: 'custom',
        signature: 'test1',
        channels: 'API',
      },
      {
        id: 'event2',
        name: 'event2',
        type: 'custom',
        signature: 'test2',
        channels: 'API',
      },
    ],
  )

  const removeEvent = (e) => {
    const newevents = events.filter((i) => i.name !== e.currentTarget.id)
    setEvents(newevents)
  }

  const collection = events.map((event) => ({
    name: <Tooltip title={event.signature}><Typography>{event.name}</Typography></Tooltip>,
    type: event.type,
    channels: event.channels,
    actions: <RemoveButton id={event.id} handleSelect={removeEvent} />,
  }))

  return (
    <CenteredPageTemplate>
      <Grid item xs={11} md="auto">
        <Typography gutterBottom variant="h6" color="primary">
          Notification plan selected
        </Typography>
      </Grid>
      <NotifierPlanDescription {...{ item: order, crypto, currentFiat }} />
      {/* Header */ }
      <Grid item xs={11} md="auto" className={classes.eventsSection}>
        <Typography gutterBottom variant="h6" color="primary">
          Notification events added
        </Typography>
        <TableContainer>
          <Marketplace
            isLoading={false}
            items={collection}
            headers={eventHeaders}
            dispatch={dispatch}
          />
        </TableContainer>
      </Grid>

      <Button variant="outlined" color="primary" rounded>
        + Add Notification Events
      </Button>
      <br />
      <br />
      <NotificationChannelsList {...{ channels: order?.item.channels }} />
    </CenteredPageTemplate>
  )
}

export default NotifierOffersSelectedPage

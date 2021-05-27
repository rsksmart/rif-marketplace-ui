import React, { FC, useState } from 'react'
import { Button } from '@rsksmart/rif-ui'
import Marketplace from 'components/templates/marketplace/Marketplace'
import TableContainer from '@material-ui/core/TableContainer'
import NotificationEventCreate from 'components/organisms/notifier/NotificationEventCreate'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import RemoveButton from 'components/atoms/RemoveButton'
import { NotifierEvent, NotifierEventParam } from 'models/marketItems/NotifierItem'
import { Item } from 'models/Market'
import { SUPPORTED_EVENTS, SupportedEventType } from 'config/notifier'
import { OffersOrder } from 'context/Services/notifier/offers/interfaces'
import RoundBtn from 'components/atoms/RoundBtn'

export type EventsRegistrarProps = {
  order?: OffersOrder
  onNext: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
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
  [K in keyof Omit<typeof eventHeaders, | 'name' | 'actions'>]: string
} & {
  signature: string
}

const buildEventSignature = (notifierEvent: NotifierEvent): string => {
  const params = notifierEvent?.params?.map(
    (input: NotifierEventParam) => `${input.name} ${input.type}`)
    .join(',')
  return `${notifierEvent.name}(${params})`
}

const isBlockEvent = (eventType: SupportedEventType): boolean => (
  eventType === SUPPORTED_EVENTS.NEWBLOCK
)

const EventsRegistrar: FC<EventsRegistrarProps> = ({ order, onNext }) => {
  const classes = useStyles()

  const [events, setEvents] = useState<Array<EventItem>>([])
  const [addEventCollapsed, setAddEventCollapsed] = useState<boolean>(false)

  const addNotifierEvent = (notifierEvent: NotifierEvent): void => {
    if (isBlockEvent(notifierEvent.type)
      && events.find((addedEvent) => isBlockEvent(
        addedEvent.type as SupportedEventType,
      ))) {
      setAddEventCollapsed(!addEventCollapsed)
      return
    }
    setEvents([
      ...events, {
        id: notifierEvent.name as string,
        type: notifierEvent.type,
        signature: isBlockEvent(notifierEvent.type) ? ''
          : buildEventSignature(notifierEvent) as string,
        channels: notifierEvent.channels.map((channel) => channel.type).join('+'),
      },
    ])
    setAddEventCollapsed(!addEventCollapsed)
  }

  const removeEvent = (e): void => {
    const newevents = events.filter(({ id }) => id !== e.currentTarget.id)
    setEvents(newevents)
  }

  const collection = events.map((event) => ({
    name: <Tooltip title={event.signature}><Typography>{event.id}</Typography></Tooltip>,
    type: event.type,
    channels: event.channels,
    actions: <RemoveButton id={event.id} handleSelect={removeEvent} />,
  }))

  const generateKey = (): string => `'eve_'${new Date().getTime()}`
  const isNextDisabled = !events.length

  return (
    <>
      <Grid item xs={11} md="auto" className={classes.eventsSection}>
        <TableContainer>
          <Marketplace
            isLoading={false}
            items={collection}
            headers={eventHeaders}
          />
        </TableContainer>
      </Grid>

      <Button
        onClick={(): void => {
          setAddEventCollapsed(!addEventCollapsed)
        }}
        variant="outlined"
        color="primary"
        rounded
      >
        + Add Notification Events
      </Button>
      <br />
      <br />
      <Collapse in={addEventCollapsed}>
        <Box mt={6} ml={6}>
          <NotificationEventCreate
            key={generateKey()}
            onAddEvent={addNotifierEvent}
            channels={order?.item.channels}
          />
        </Box>
      </Collapse>
      <RoundBtn onClick={onNext} disabled={isNextDisabled}>
        Next
      </RoundBtn>
    </>
  )
}

export default EventsRegistrar

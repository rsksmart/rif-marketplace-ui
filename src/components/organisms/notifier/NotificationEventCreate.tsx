import React, { FC, useState } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import GridRow from 'components/atoms/GridRow'
import { useForm } from 'react-hook-form'
import GridItem from 'components/atoms/GridItem'
import { notifierEventTypeLabels } from 'constants/notifier/strings'
import {
  SUPPORTED_EVENTS, SupportedEventType, SupportedEventChannel, SUPPORTED_EVENT_TYPES,
} from 'config/notifier'
import NotificationChannelsList from 'components/organisms/notifier/NotificationChannelsList'
import RoundBtn from 'components/atoms/RoundBtn'
import { NotifierChannel, NotifierEvent, NotifierEventParam } from 'models/marketItems/NotifierItem'
import { ContractABIEvent } from 'api/blockscout/interface'
import getABIEvents from 'api/blockscout'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import useErrorReporter from 'hooks/useErrorReporter'

const useStyles = makeStyles((theme: Theme) => ({
  select: {
    textAlign: 'center',
    height: 40,
  },
  button: {
    marginTop: theme.spacing(5),
  },
  gridRow: {
    marginTop: theme.spacing(5),
  },
}))

type Inputs = {
  contract: string
}

type Props = {
  onAddEvent: (event: NotifierEvent) => void
  channels?: Array<SupportedEventChannel>
}

type EventData = {
  contract: string
  event: ContractABIEvent
  eventType: SupportedEventType
  addedChannels: Array<NotifierChannel>
}

const NotificationEventCreate: FC<Props> = ({
  onAddEvent, channels,
}) => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const [events, setEvents] = useState<Array<ContractABIEvent>>([])
  const [eventData, setEventData] = useState<Partial<EventData>>({
    eventType: SUPPORTED_EVENTS.SMARTCONTRACT,
  })

  const classes = useStyles()
  const reportError = useErrorReporter()

  const loadContractEvents = (address: string): void => {
    getABIEvents(address).then((abiEvents: ContractABIEvent[]) => {
      setEvents(abiEvents)

      if (abiEvents.length) {
        setEventData({ ...eventData, event: abiEvents[0] })
      }
    }).catch((error) => {
      reportError({
        error,
        id: 'contract-notifier',
        text: error.text,
      })
      setEvents([])
    })
  }

  const handleEventChange = ({ target: { value } }): void => {
    setEventData({
      ...eventData,
      event: events.find(({ name }) => name === value) as ContractABIEvent,
    })
  }

  const handleEventTypeChange = ({ target: { value } }): void => {
    setEventData({ ...eventData, eventType: value })
  }

  const handleContractChange = ({ target: { value } }): void => {
    loadContractEvents(value)
    setEventData({ ...eventData, contract: value })
  }

  const handleAddChannels = (selectedChannels: Array<NotifierChannel>): void => {
    setEventData({ ...eventData, addedChannels: selectedChannels })
  }

  const handleAddEvent = (data: Inputs): void => {
    if (eventData.addedChannels?.length
        && (eventData.eventType === SUPPORTED_EVENTS.NEWBLOCK
            || eventData.event)) {
      onAddEvent({
        smartContract: data.contract,
        name: eventData.eventType === SUPPORTED_EVENTS.NEWBLOCK ? 'NEWBLOCK' : eventData.event?.name,
        channels: eventData.addedChannels,
        type: eventData.eventType as SupportedEventType,
        params: eventData.event?.inputs as Array<NotifierEventParam>,
      })
      setEventData({ eventType: SUPPORTED_EVENTS.SMARTCONTRACT })
    }
  }

  return (
    <form>
      <Grid container spacing={4}>
        <GridRow>
          <GridItem xs>
            <Typography gutterBottom variant="h6" color="primary">
              Which event would you like to listen to?
            </Typography>
            <Typography gutterBottom color="secondary" variant="body2">
              Select the event to be listened
            </Typography>
            <Select
              name="eventType"
              onChange={handleEventTypeChange}
              value={eventData.eventType ?? SUPPORTED_EVENTS.SMARTCONTRACT}
              variant="outlined"
              className={classes.select}
              id="event-type-select"
            >
              {
                  SUPPORTED_EVENT_TYPES.map((eventType) => (
                    <MenuItem
                      key={eventType}
                      value={eventType}
                    >
                      {notifierEventTypeLabels[eventType]}
                    </MenuItem>
                  ))
                }
            </Select>
          </GridItem>
        </GridRow>
        { eventData.eventType === SUPPORTED_EVENTS.SMARTCONTRACT && (
        <>
          <GridRow spacing={4} className={classes.gridRow}>
            <GridItem>
              <Typography gutterBottom color="secondary" variant="body2">
                Smart Contract
              </Typography>
            </GridItem>
            <GridItem>
              <TextField
                name="contract"
                inputRef={register({ required: true })}
                onChange={handleContractChange}
                variant="outlined"
                InputProps={{
                  style: { width: 400, height: 40 },
                }}
              />
              {
                errors.contract && (
                <Typography color="error" variant="caption">
                  Invalid Contract Address
                </Typography>
                )
              }
            </GridItem>
          </GridRow>
          <GridRow spacing={5} className={classes.gridRow}>
            <GridItem>
              <Typography gutterBottom color="secondary" variant="body2">
                Event
              </Typography>
            </GridItem>
            <GridItem>
              <Box pl={7}>
                <Select
                  name="eventName"
                  onChange={handleEventChange}
                  value={eventData.event?.name || ''}
                  className={classes.select}
                  id="event"
                  variant="outlined"
                >
                  {
                    events.map((event) => (
                      <MenuItem
                        key={event.name}
                        value={event.name}
                      >
                        {event.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </Box>
            </GridItem>
          </GridRow>
        </>
        )}
      </Grid>
      <Grid>
        <Box mt={4}>
          <NotificationChannelsList
            channels={channels}
            onEventChannelsUpdate={handleAddChannels}
          />
        </Box>
        <GridRow justify="center" spacing={2}>
          <RoundBtn
            disabled={!(eventData.addedChannels?.length
                && (eventData.eventType === SUPPORTED_EVENTS.NEWBLOCK
                    || eventData.event))}
            onClick={handleSubmit(handleAddEvent)}
          >
            Submit
          </RoundBtn>
        </GridRow>
      </Grid>
    </form>

  )
}

export default NotificationEventCreate

import React, {
  FC, useContext, useState,
} from 'react'
import {
  Grid,
  Typography,
} from '@material-ui/core'
import { NotifierOffersContextProps as ContextProps, NotifierOffersContext } from 'context/Services/notifier/offers'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import NotifierPlanDescription from 'components/organisms/notifier/NotifierPlanDescription'
import MarketContext, { MarketContextProps } from 'context/Market'
import CheckoutStepper from 'components/organisms/notifier/buy/CheckoutStepper'
import { logNotImplemented } from 'utils/utils'
import { NotifierEventItem } from 'models/marketItems/NotifierEventItem'

const NotifierOfferCheckoutPage: FC = () => {
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
  } = useContext<ContextProps>(NotifierOffersContext)

  const [eventsAdded, setEventsAdded] = useState<NotifierEventItem[]>([])

  if (!order?.item) return null

  const handleEventItemRemoved = (
    { id: notifierEventId }: NotifierEventItem,
  ): void => {
    const filteredEvents = eventsAdded.filter(
      ({ id }) => id === notifierEventId,
    )
    setEventsAdded(filteredEvents)
  }

  const handleEventItemAdded = (
    eventItem: NotifierEventItem,
  ): void => {
    setEventsAdded([...eventsAdded, eventItem])
  }

  const handleOnBuy = (): void => {
    // TODO: all data should be here ready to interact with SC
    // console.log({ order })
    // console.log({ addedEvents: eventsAdded })
    logNotImplemented('buy notification plan')
  }

  return (
    <CenteredPageTemplate>
      <Grid item xs={11} md="auto">
        <Typography gutterBottom variant="h6" color="primary">
          Notification plan selected
        </Typography>
      </Grid>
      <NotifierPlanDescription {...{ item: order.item, crypto, currentFiat }} />
      <CheckoutStepper
        onBuy={handleOnBuy}
        onEventItemAdded={handleEventItemAdded}
        onEventItemRemoved={handleEventItemRemoved}
        order={order}
        eventsAdded={eventsAdded}
      />
    </CenteredPageTemplate>
  )
}

export default NotifierOfferCheckoutPage

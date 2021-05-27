import React, {
  FC, useContext,
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

  if (!order?.item) return null

  // TODO: remove hardcoded
  const handleOnBuy = logNotImplemented('buy notification plan')

  return (
    <CenteredPageTemplate>
      <Grid item xs={11} md="auto">
        <Typography gutterBottom variant="h6" color="primary">
          Notification plan selected
        </Typography>
      </Grid>
      <NotifierPlanDescription {...{ item: order.item, crypto, currentFiat }} />
      <CheckoutStepper onBuy={handleOnBuy} order={order} />
    </CenteredPageTemplate>
  )
}

export default NotifierOfferCheckoutPage

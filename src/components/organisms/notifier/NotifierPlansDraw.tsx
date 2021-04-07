import { Collapse } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import NotifierPlan from 'components/molecules/notifier/NotifierPlan'
import { MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, PriceOption } from 'models/marketItems/NotifierItem'
import React, { FC } from 'react'

type Props = {
    plans: NotifierOfferItem[]
    isOpen: boolean
    onPlanSelected: (plan: NotifierOfferItem, priceOption: PriceOption) => void
    currentFiat: string
    crypto: MarketCryptoRecord
}

const NotifierPlansDraw: FC<Props> = ({
  plans, isOpen, crypto, currentFiat,
  onPlanSelected,
}) => (
  <Collapse
    in={isOpen}
    timeout="auto"
    unmountOnExit
    style={{
      marginBottom: '50px',
    }}
  >
    <Grid
      container
      spacing={3}
    >
      {plans.map((plan) => (
        <Grid
          item
          xs={3}
          key={plan.id}
        >
          <NotifierPlan
            onSelect={(priceOption): void => {
              onPlanSelected(plan, priceOption)
            }}
            {...{ currentFiat, crypto, ...plan }}
          />
        </Grid>
      ))}
    </Grid>
  </Collapse>
)

export default NotifierPlansDraw

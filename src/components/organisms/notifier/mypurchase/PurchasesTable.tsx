import {
  makeStyles, TableContainer, Theme,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Marketplace from 'components/templates/marketplace/Marketplace'
import React, {
  FC,
} from 'react'

export type PurchasesProps = {
  subscriptions: any[]
}

const useStyles = makeStyles((theme: Theme) => ({
  noSubscriptions: {
    margin: theme.spacing(3),
  },
}))

const PurchasesTable: FC<PurchasesProps> = (
  { subscriptions },
) => {
  const classes = useStyles()
  // const {
  //   state: {
  //     exchangeRates: {
  //       currentFiat,
  //       crypto,
  //     },
  //   },
  // } = useContext(MarketContext)

  if (!subscriptions.length) {
    return (
      <Typography
        className={classes.noSubscriptions}
        align="center"
        color="secondary"
      >
        No purchases yet
      </Typography>
    )
  }

  const headers = {
    subscriptionId: 'Subscription ID',
    provider: 'Provider',
    notifications: 'Notifications',
    expirationDate: 'Expiration Date',
    price: 'Price',
    renew: '',
    view: '',
  }

  return (
    <>
      <TableContainer>
        <Marketplace
          headers={headers}
          isLoading={false}
          items={subscriptions}
        />
      </TableContainer>
    </>
  )
}

export default PurchasesTable

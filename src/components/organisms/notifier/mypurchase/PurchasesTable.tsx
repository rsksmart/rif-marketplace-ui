import {
  makeStyles, Theme,
} from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import Typography from '@material-ui/core/Typography'
import Marketplace from 'components/templates/marketplace/Marketplace'
import { Item } from 'models/Market'
import React, {
  FC,
} from 'react'

const headers = {
  subId: 'Subscription ID',
  provider: 'Provider',
  notifications: 'Notifications',
  expirationDate: 'Expiration Date',
  price: 'Price',
  status: 'Status',
  actions: '',
} as const

export type MySubscriptionHeaders = typeof headers

export type MySubscription = Item & {
  [K in keyof typeof headers]: React.ReactElement
}

type Props = {
  items: Array<MySubscription>
}

const useStyles = makeStyles((theme: Theme) => ({
  noSubscriptions: {
    margin: theme.spacing(3),
  },
}))

const PurchasesTable: FC<Props> = ({ items: subscriptions }) => {
  const classes = useStyles()

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

  return (
    <TableContainer>
      <Marketplace
        headers={headers}
        isLoading={false}
        items={subscriptions}
      />
    </TableContainer>
  )
}

export default PurchasesTable

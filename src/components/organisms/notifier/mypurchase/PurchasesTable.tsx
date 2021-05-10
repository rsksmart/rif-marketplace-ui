import {
  makeStyles, TableContainer, Theme,
} from '@material-ui/core'
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
  actions: '',
} as const

export type MySubscriptionHeaders = typeof headers

export type MySubscription = Item & {
  [K in keyof typeof headers]: React.ReactElement
}

type Props = {
  items: Array<MySubscription>
  isTableLoading: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  noSubscriptions: {
    margin: theme.spacing(3),
  },
}))

const PurchasesTable: FC<Props> = ({ items: subscriptions, isTableLoading }) => {
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
        isLoading={isTableLoading}
        items={subscriptions}
      />
    </TableContainer>
  )
}

export default PurchasesTable

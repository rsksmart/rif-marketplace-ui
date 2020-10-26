import Typography from '@material-ui/core/Typography'
import TableContainer from '@material-ui/core/TableContainer'
import createItemFields from 'components/pages/storage/myPurchases/utils'
import Marketplace from 'components/templates/marketplace/Marketplace'
import MarketContext from 'context/Market/MarketContext'
import { Agreement } from 'models/marketItems/StorageItem'
import React, { FC, useContext } from 'react'

export type ActiveContractsProps = {
  agreements: Agreement[]
}

const ActiveContracts: FC<ActiveContractsProps> = ({ agreements }) => {
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)

  if (!agreements.length) {
    return (
      <Typography
        align="center"
        color="secondary"
      >
        No active contracts yet
      </Typography>
    )
  }
  const items = createItemFields(
    agreements, crypto, currentFiat, () => undefined, 'Provider',
  )

  const headers = {
    customer: 'Customer',
    contentSize: 'Content size',
    renewalDate: 'Renewal date',
    subscriptionPeriod: 'Subscription type',
    monthlyFee: 'Monthly fee',
    availableFunds: 'Available funds',
    withdraw: '',
    view: '',
  }

  return (
    <TableContainer>
      <Marketplace
        headers={headers}
        isLoading={false}
        items={items}
      />
    </TableContainer>
  )
}

export default ActiveContracts

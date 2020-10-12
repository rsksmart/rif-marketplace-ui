import React, { FC, useContext } from 'react'
import {
  Grid, TableContainer, Typography,
} from '@material-ui/core'
import ItemWUnit from 'components/atoms/ItemWUnit'
import RoundedCard from 'components/atoms/RoundedCard'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import Marketplace from 'components/templates/marketplace/Marketplace'
import MarketContext from 'context/Market/MarketContext'
import AgreementsContext, { AgreementContextProps } from 'context/Services/storage/agreements'
import { Agreement } from 'models/marketItems/StorageItem'
import { UNIT_PREFIX_POW2 } from 'utils/utils'

const MyStoragePurchases: FC = () => {
  const {
    state: {
      agreements,
    },
  } = useContext<AgreementContextProps>(AgreementsContext)
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)

  const headers = {
    title: 'Title',
    provider: 'Provider',
    contentSize: 'Content size',
    renewalDate: 'Renewal date',
    subscriptionType: 'Subscription type',
    monthlyFee: 'Monthly fee',
    renew: '',
    view: '',
  }

  type Fields = {
      [K in keyof typeof headers]: string | JSX.Element
  }

  const items: Fields[] = agreements.map(({
    provider,
    monthlyFee,
    renewalDate,
    paymentToken,
    size,
    subscriptionPeriod,
    title,
    id,
  }: Agreement) => {
    const currency = crypto[paymentToken]

    return {
      id,
      title: <AddressItem value={title || id} />,
      contentSize: <ItemWUnit
        type="mediumPrimary"
        value={size.div(UNIT_PREFIX_POW2.KILO).toPrecision(2)}
        unit="GB"
      />,
      monthlyFee: <CombinedPriceCell
        price={monthlyFee.toPrecision(2)}
        priceFiat={currency && monthlyFee.times(currency.rate).toPrecision(3)}
        currency={currency && currency.displayName}
        currencyFiat={currentFiat.displayName}
        divider=" "
      />,
      provider: <AddressItem value={provider} />,
      renewalDate: renewalDate.toLocaleDateString(),
      subscriptionType: subscriptionPeriod,
      renew:
  <SelectRowButton
    id={id}
    handleSelect={(): void => undefined}
  >
    Renew
  </SelectRowButton>,
      view:
  <SelectRowButton
    id={id}
    handleSelect={(): void => undefined}
  >
    View
  </SelectRowButton>,
    }
  })

  return (
    <CenteredPageTemplate>
      <RoundedCard color="secondary">
        <Grid container>
          <Typography gutterBottom color="primary" variant="subtitle1">Active contracts</Typography>
          <TableContainer>
            <Marketplace
              headers={headers}
              isLoading={false}
              items={items}
            />
          </TableContainer>
        </Grid>
      </RoundedCard>

    </CenteredPageTemplate>
  )
}

export default MyStoragePurchases

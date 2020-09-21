import React, { FC } from 'react'
import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { Typography } from '@material-ui/core'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import { CombinedPriceCell } from 'components/molecules'

export type PlanOptionProps = {
    plan: BillingPlan
    xr: {
        fiat: string
        rate: number
    }
}

const PlanOption: FC<PlanOptionProps> = ({ plan, xr }) => {
  const { currency, period, price } = plan
  const { fiat, rate } = xr
  return (
    <GridRow
      wrap="nowrap"
      key={currency + period + price}
      style={{
        paddingBlockEnd: '0em',
      }}
    >
      <GridItem>
        <Typography variant="subtitle2">{period}</Typography>
      </GridItem>
      <GridItem>
        <CombinedPriceCell
          currency={tokenDisplayNames[currency]}
          currencyFiat={fiat}
          price={price.toString()}
          priceFiat={price.mul(rate).toString()}
          divider=" "
        />
      </GridItem>
    </GridRow>
  )
}

export default PlanOption

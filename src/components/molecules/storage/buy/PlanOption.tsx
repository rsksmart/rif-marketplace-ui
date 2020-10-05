import React, { FC } from 'react'
import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { makeStyles, Typography } from '@material-ui/core'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import { CombinedPriceCell } from 'components/molecules'

const useGridRowStyle = makeStyles(() => ({
  root: {
    paddingBlockEnd: '0em',
  },
}))

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
      spacing={1}
      classes={useGridRowStyle()}
    >
      <GridItem>
        <Typography variant="subtitle2">{period}</Typography>
      </GridItem>
      <GridItem>
        <CombinedPriceCell
          currency={tokenDisplayNames[currency]}
          currencyFiat={fiat}
          price={price.toFixed(6)}
          priceFiat={price.mul(rate).toFixed(3)}
          divider=" "
        />
      </GridItem>
    </GridRow>
  )
}

export default PlanOption

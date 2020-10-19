import { StakedBalances as StakedBalancesProp } from 'api/rif-marketplace-cache/storage/stakes'
import LabelWithValue from 'components/atoms/LabelWithValue'
import React, { FC } from 'react'

export interface StakedBalancesProps {
  stakes: StakedBalancesProp
}

const StakedBalances: FC<StakedBalancesProps> = ({ stakes }) => {
  return (
    <>
      {
        Object.keys(stakes)
          .map((symbol) =>
            <LabelWithValue
              key={symbol}
              label={symbol}
              value={stakes[symbol]} />
          )
      }
    </>
  )

}

export default StakedBalances

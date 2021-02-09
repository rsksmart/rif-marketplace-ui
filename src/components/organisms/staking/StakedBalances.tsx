import { StakedBalances as StakedBalancesProp } from 'api/rif-marketplace-cache/storage/stakes'
import LabelWithValue from 'components/atoms/LabelWithValue'
import React, { FC } from 'react'
import { getTokenByString } from 'utils/tokenUtils'

export interface StakedBalancesProps {
  stakes: StakedBalancesProp
}

const StakedBalances: FC<StakedBalancesProps> = ({ stakes }) => (
  <>
    {
      Object.keys(stakes)
        .map((symbol) => (
          <LabelWithValue
            key={symbol}
            label={getTokenByString(symbol).displayName}
            value={stakes[symbol]}
          />
        ))
    }
  </>
)

export default StakedBalances

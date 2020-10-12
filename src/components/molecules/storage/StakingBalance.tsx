import { Typography } from '@material-ui/core'
import { WithSpinner } from '@rsksmart/rif-ui'
import React, { FC } from 'react'

export type StakingBalanceProps = {
  totalStaked: string
  units: string
}

const StakingBalance: FC<StakingBalanceProps> = ({ totalStaked, units }) => (
  <Typography color="primary" variant="h6">
    {`${totalStaked} ${units}`}
  </Typography>
)

export default WithSpinner(StakingBalance)

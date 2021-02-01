import Typography from '@material-ui/core/Typography'
import { BaseToken } from 'models/Token'
import React, { FC } from 'react'

export type NotEnoughFundsProps = {
  token: BaseToken
}

const NotEnoughFunds: FC<NotEnoughFundsProps> = ({ token }) => (
  <Typography color="error" align="center">
    {`You do not have enough ${token.displayName}`}
  </Typography>
)

export default NotEnoughFunds

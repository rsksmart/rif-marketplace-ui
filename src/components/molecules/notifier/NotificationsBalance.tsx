import Grid, { GridProps } from '@material-ui/core/Grid/Grid'
import MarketplaceCell from 'components/atoms/MarketplaceCell'
import React, { FC } from 'react'

type Props = {
    balance: number
    limit: number
} & GridProps

const NotificationsBalance: FC<Props> = ({ balance, limit, ...gridProps }) => (
  <Grid container wrap="nowrap" spacing={1} {...gridProps}>
    <Grid item>
      <MarketplaceCell>
        {`${Math.abs(limit - balance)}/${limit}`}
      </MarketplaceCell>
    </Grid>
    <Grid item>
      <MarketplaceCell color="textPrimary">
        {`(${balance > limit ? 0 : balance} left)`}
      </MarketplaceCell>
    </Grid>
  </Grid>
)

export default NotificationsBalance

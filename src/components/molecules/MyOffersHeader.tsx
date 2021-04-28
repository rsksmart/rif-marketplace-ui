import {
  Grid, Typography,
} from '@material-ui/core'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import React, {
  FC,
} from 'react'

type Props = { title?: string }

const MyOffersHeader: FC<Props> = ({ title, children }) => (
  <Grid container alignItems="center" justify="space-between">
    <Grid container item xs={10} alignItems="center">
      <Grid item xs={1}>
        <img src={handProvidingFunds} alt="hand providing funds" />
      </Grid>
      <Grid item xs={11} md="auto">
        <Typography gutterBottom variant="h6" color="primary">
          {title ?? 'You are providing the following plans to your customers'}
        </Typography>
      </Grid>
    </Grid>
    <Grid container item xs={2} justify="flex-end">
      {children}
    </Grid>
  </Grid>
)

export default MyOffersHeader

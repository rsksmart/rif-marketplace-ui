import React, {
  FC,
} from 'react'
import {
  Grid, Typography,
} from '@material-ui/core'

type Props = {
    title?: string
    icon: React.ReactElement
}

const TabHeader: FC<Props> = ({ title, icon, children }) => (
  <Grid container alignItems="center" justify="space-between">
    <Grid container item xs={10} alignItems="center">
      <Grid item xs={1}>
        {icon}
        {/* <img src={handProvidingFunds} alt="hand providing funds" /> */}
      </Grid>
      <Grid item xs={11} md="auto">
        <Typography gutterBottom variant="h6" color="primary">
          {title}
        </Typography>
      </Grid>
    </Grid>
    <Grid container item xs={2} justify="flex-end">
      {children}
    </Grid>
  </Grid>
)

export default TabHeader

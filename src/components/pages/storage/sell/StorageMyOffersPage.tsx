import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button, colors } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'

const useStyles = makeStyles((theme: Theme) => ({
  stakingRoot: {
    border: `1px solid ${colors.primary}`,
    borderRadius: 15,
    maxWidth: theme.spacing(200),
  },
}))

const StorageMyOffersPage: FC = () => {
  const classes = useStyles()
  return (
    <CenteredPageTemplate title="">
      {/* TODO: replace styles with clases and move to organisms/molecules */}
      <Grid className={classes.stakingRoot} container>
        <Grid
          container
          style={{ padding: 15 }}
          alignItems="center"
        >
          <Grid item xs={4} md={3}>
            <Typography color="primary" align="center">
              Staking
            </Typography>
          </Grid>
          <Grid item xs={8} md={9}>
            <Typography component="div" color="secondary">
              The amount of RIF staked in the marketplace helps to
              {' '}
              <Box display="inline" fontWeight="fontWeightMedium">enhance your reputation</Box>
              {' '}
              and
              {' '}
              <Box display="inline" fontWeight="fontWeightMedium">position your offers</Box>
              {' '}
              at the top when selling storage.
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          style={{
            padding: 15,
            borderTop: `1px solid ${colors.primary}`,
          }}
          alignItems="center"
        >
          <Grid xs={3}>
            <Typography color="secondary" align="center" component="div"><Box fontWeight="fontWeightMedium">BALANCE</Box></Typography>
          </Grid>
          <Grid xs={3}>
            <Typography color="primary">2048 RIF</Typography>
          </Grid>
          <Grid
            xs={3}
            style={{
              display: 'flex',
              alignContent: 'center',
            }}
          >
            <Button variant="outlined" rounded color="primary">Add funds</Button>
          </Grid>
          <Grid xs={3} alignItems="center">
            <Button variant="outlined" rounded color="primary">Withdraw funds</Button>
          </Grid>
        </Grid>
      </Grid>
      {/* TODO: Add icon */}
      <Typography gutterBottom variant="h5" color="primary">You are providing the following storage space to your customers</Typography>

    </CenteredPageTemplate>
  )
}

export default StorageMyOffersPage

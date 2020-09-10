import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import StakingCard from 'components/organisms/storage/myoffers/StakingCard'
import ExpandableOffer from 'components/organisms/storage/myoffers/ExpandableOffer'
import Logger from 'utils/Logger'
import { makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  expandableOffer: {
    margin: theme.spacing(2, 0),
  },
}))

const logger = Logger.getInstance()

const StorageMyOffersPage: FC = () => {
  const classes = useStyles()
  return (
    <CenteredPageTemplate>
      <StakingCard
        balance="2048 RIF"
        onAddFunds={() => logger.info('Add funds clicked')}
        onWithdrawFunds={() => logger.info('withdraw funds clicked')}
      />
      <Grid
        container
        alignItems="center"
        style={{ marginTop: 12 }}
      >
        <Grid item xs="auto">
          <img src={handProvidingFunds} alt="hand providing funds" />
        </Grid>
        <Grid item xs={10} md="auto">
          <Typography gutterBottom variant="h5" color="primary">
            You are providing the following storage space to your customers
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <ExpandableOffer className={classes.expandableOffer} offerName="Offer 1" />
        <ExpandableOffer className={classes.expandableOffer} offerName="Offer 2" />
      </Grid>
    </CenteredPageTemplate>
  )
}

export default StorageMyOffersPage

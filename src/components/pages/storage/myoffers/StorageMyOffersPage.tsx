import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import StakingCard from 'components/organisms/storage/myoffers/StakingCard'
import ExpandableOffer from 'components/organisms/storage/myoffers/ExpandableOffer'
import Logger from 'utils/Logger'

const logger = Logger.getInstance()

const StorageMyOffersPage: FC = () => (
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
      <ExpandableOffer offerName="Offer 1" />
      <ExpandableOffer offerName="Offer 2" />
    </Grid>
  </CenteredPageTemplate>
)

export default StorageMyOffersPage

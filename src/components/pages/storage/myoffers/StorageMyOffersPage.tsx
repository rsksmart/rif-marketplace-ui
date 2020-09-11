import React, { FC, useContext, useEffect } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import StakingCard from 'components/organisms/storage/myoffers/StakingCard'
import Logger from 'utils/Logger'
import { Web3Store } from '@rsksmart/rif-ui'
import StorageOffersContext, { StorageOffersContextProps } from 'context/Services/storage/OffersContext'
// import { StorageOffer } from 'models/marketItems/StorageItem'
// import Big from 'big.js'
import OffersList from 'components/organisms/storage/myoffers/OffersList'

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
  resultsContainer: {
    marginTop: theme.spacing(2),
  },
}))

const StorageMyOffersPage: FC = () => {
  const classes = useStyles()
  const {
    state: { account },
  } = useContext(Web3Store)

  const {
    state: {
      listing: { items },
    },
    dispatch,
  } = useContext<StorageOffersContextProps>(StorageOffersContext)

  useEffect(() => {
    // TODO: handle no account - create a reusable HOC?
    // TODO: handle is loading
    if (account) {
      dispatch({
        type: 'FILTER',
        payload: { provider: account },
      })
    }
  }, [account, dispatch])

  // TODO: remove temporal mocked data
  // const mockedOffers: StorageOffer[] = [
  //   {
  //     id: '1',
  //     availableSizeGB: new Big(50),
  //     averagePrice: 100,
  //     location: 'Uruguay',
  //     subscriptionOptions: [],
  //     system: 'IPFS'
  //   }, {
  //     id: '2',
  //     availableSizeGB: new Big(70),
  //     averagePrice: 100,
  //     location: 'Uruguay',
  //     subscriptionOptions: [],
  //     system: 'IPFS'
  //   }
  // ]

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
        className={classes.resultsContainer}
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
      <OffersList items={items} />
    </CenteredPageTemplate>
  )
}

export default StorageMyOffersPage

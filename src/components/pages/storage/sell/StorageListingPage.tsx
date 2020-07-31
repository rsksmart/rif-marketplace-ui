import React, { useContext } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button as RUIButton, Web3Store } from '@rsksmart/rif-ui'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PlanItemsList from 'components/organisms/storage/listing/PlanItemsList'
import BaseSettings from 'components/organisms/storage/listing/BaseSettings'
import StorageListingStore from 'store/Market/storage/ListingStore'
import StorageContract from 'contracts/Storage'
import Logger from 'utils/Logger'
import { StoragePlanItem } from 'store/Market/storage/interfaces'

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(10),
    width: '100%',
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: theme.spacing(100),
    },
    width: '100%',
  },
  planGrid: {
    marginBottom: theme.spacing(3),
  },
}))

const StorageListingPage = () => {
  const {
    state: {
      planItems, availableSize, currency, system,
    },
  } = useContext(StorageListingStore)

  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)

  const classes = useStyles()

  const handleSubmit = async () => {
    // TODO: remove logic from the view and call a service directly with the data
    const storageContract = StorageContract.getInstance(web3)
    const gasPrice = await web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error(`error getting gas price ${error}`)
      })

    const timePeriods: number[] = planItems.map((plan: StoragePlanItem) => plan.timePeriod)
    const billingPrices: number[] = planItems.map((plan: StoragePlanItem) => plan.pricePerGb)

    const setOfferReceipt = await storageContract
      .setOffer(availableSize, timePeriods, billingPrices, { from: account, gasPrice })
      .catch((error) => {
        logger.error(`Error setting the offer ${error}`)
      })
    logger.info('setOffer receipt: ', setOfferReceipt)
  }

  const isSubmitEnabled = planItems.length
    && availableSize
    && currency
    && system

  return (
    <div className={classes.root}>
      <div className={`${classes.container}`}>
        <Typography gutterBottom variant="h5" color="primary">List storage service</Typography>
        <Typography gutterBottom color="secondary" variant="subtitle1" align="center">
          Fill out the form below to list your service. All information provided is meant to be true and correct.
        </Typography>
        <Grid className={classes.planGrid} container spacing={5}>
          <BaseSettings />
          <PlanItemsList />
        </Grid>
        <RUIButton
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
          color="primary"
          rounded
          variant="contained"
        >
          List storage
        </RUIButton>
        {
          !!isSubmitEnabled
          && (
            <Typography gutterBottom color="secondary" variant="subtitle1" align="center">
              Your wallet will open and you will be asked to confirm the transaction for listing your service.
            </Typography>
          )
        }
      </div>
    </div>
  )
}

export default StorageListingPage

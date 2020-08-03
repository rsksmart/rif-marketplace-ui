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
import { convertGbsToBytes, convertDaysToSeconds } from 'utils/utils'
import { UIError } from 'models/UIMessage'

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

interface OfferContractData {
  availableSizeBytes: number
  periods: number[]
  prices: number[]
}

const transformOfferDataForContract = (availableSizeGbs: number, planItems: StoragePlanItem[]): OfferContractData => {
  const periods: number[] = []
  const prices: number[] = []

  planItems.forEach((planItem: StoragePlanItem) => {
    periods.push(convertDaysToSeconds(planItem.timePeriod))
    prices.push(planItem.pricePerGb)
  })

  return {
    availableSizeBytes: convertGbsToBytes(availableSizeGbs),
    periods,
    prices,
  }
}

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
    const storageContract = StorageContract.getInstance(web3)

    const {
      availableSizeBytes, periods, prices,
    } = transformOfferDataForContract(availableSize, planItems)

    const setOfferReceipt = await storageContract
      .setOffer(availableSizeBytes, periods, prices, { from: account })
      .catch((error) => {
        // TODO: display error properly
        throw new UIError({
          error,
          id: 'contract-storage-set-offer',
          text: 'Could not set the offer in the contract.',
        })
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

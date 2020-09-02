import React, {
  useContext, useCallback, useState, useEffect,
} from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button as RUIButton, Web3Store } from '@rsksmart/rif-ui'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PlanItemsList from 'components/organisms/storage/listing/PlanItemsList'
import BaseSettings from 'components/organisms/storage/listing/BaseSettings'
import StorageListingContext from 'context/Services/storage/ListingContext'
import StorageContract from 'contracts/Storage'
import Logger from 'utils/Logger'
import { StoragePlanItem } from 'context/Services/storage/interfaces'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { UIError } from 'models/UIMessage'
import Login from 'components/atoms/Login'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Big from 'big.js'
import { convertToWeiString } from 'utils/parsers'
import AppContext, { errorReporterFactory } from 'context/App/AppContext'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import { AddTxPayload } from 'context/Blockchain/blockchainActions'
import BlockchainContext from 'context/Blockchain/BlockchainContext'
import { LoadingPayload } from 'context/App/appActions'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import { PeriodInSeconds } from 'models/marketItems/StorageItem'

// TODO: discuss about wrapping the library and export it with this change
Big.NE = -30

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
  planGrid: {
    marginBottom: theme.spacing(3),
  },
  progressContainer: {
    background: 'rgba(275, 275, 275, 0.8)',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
}))

interface OfferContractData {
  availableSizeMB: string
  periods: number[]
  prices: string[]
}

const transformOfferDataForContract = (
  availableSizeGB: number,
  planItems: StoragePlanItem[],
): OfferContractData => {
  const periods: number[] = []
  const prices: string[] = []

  planItems.forEach((planItem: StoragePlanItem) => {
    periods.push(planItem.timePeriod * PeriodInSeconds.Daily)
    // we get the price/gb but need to send price/byte
    const pricePerByte = new Big(planItem.pricePerGb).div(UNIT_PREFIX_POW2.GIGA)
    prices.push(convertToWeiString(pricePerByte))
  })

  return {
    availableSizeMB: new Big(availableSizeGB)
      .mul(UNIT_PREFIX_POW2.KILO).toString(),
    periods,
    prices,
  }
}

const StorageListingPage = () => {
  const {
    state: {
      planItems, availableSize, currency, system,
    },
    dispatch,
  } = useContext(StorageListingContext)

  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)
  const { dispatch: bcDispatch } = useContext(BlockchainContext)

  const { dispatch: appDispatch } = useContext(AppContext)
  const reportError = useCallback((e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const [isPendingConfirm, setIsPendingConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const classes = useStyles()
  const history = useHistory()

  const handleSubmit = async () => {
    // without a web3 instance the submit action would be disabled
    if (!web3) return
    try {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Listing your offer...',
        } as LoadingPayload,
      } as any)

      setIsProcessing(true)
      const storageContract = StorageContract.getInstance(web3)
      const {
        availableSizeMB, periods, prices,
      } = transformOfferDataForContract(availableSize, planItems)

      const setOfferReceipt = await storageContract.setOffer(availableSizeMB, periods, prices, { from: account })
      logger.info('setOffer receipt: ', setOfferReceipt)

      bcDispatch({
        type: 'SET_TX_HASH',
        payload: {
          txHash: setOfferReceipt.transactionHash,
        } as AddTxPayload,
      })
      setIsPendingConfirm(true)
    } catch (error) {
      reportError(new UIError({
        error,
        id: 'contract-storage-set-offer',
        text: 'Could not set the offer in the contract.',
      }))
      setIsProcessing(false)
    } finally {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: false,
          id: 'contract',
        } as LoadingPayload,
      } as any)
    }
  }

  const onProcessingComplete = () => {
    setIsProcessing(false)
  }

  useEffect(() => {
    if (isPendingConfirm && !isProcessing) {
      // Post-confirmations handle
      history.replace(ROUTES.STORAGE.SELL.DONE)
    }
  }, [isPendingConfirm, history, isProcessing])

  useEffect(() => () => {
    dispatch({
      type: 'CLEAN_UP',
      payload: {},
    })
  }, [dispatch])

  const isSubmitEnabled = planItems.length
    && availableSize
    && currency
    && system

  const action = account
    ? (
      <>
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
      </>
    )
    : <Login />

  return (
    <CenteredPageTemplate
      title="List storage service"
      subtitle="Fill out the form below to list your service. All information provided is meant to be true and correct."
    >
      <Grid className={classes.planGrid} container spacing={5}>
        <BaseSettings />
        <PlanItemsList />
      </Grid>
      {action}
      {
        isProcessing
        && (
          <div className={classes.progressContainer}>
            <TransactionInProgressPanel
              {...{ isPendingConfirm, onProcessingComplete }}
              text="Listing your offer!"
              progMsg="The waiting period is required to securely list your offer.
             Please do not close this tab until the process has finished."
            />
          </div>
        )
      }
    </CenteredPageTemplate>
  )
}

export default StorageListingPage

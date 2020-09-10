import React, {
  useContext, useCallback, useState, useEffect,
} from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button as RUIButton, Web3Store } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import StorageSellContext from 'context/Services/storage/StorageSellContext'
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
import StakingCard from 'components/organisms/storage/myoffers/StakingCard'
import SellStepper from 'components/organisms/storage/sell/SellStepper'
import RoundedCard from 'components/atoms/RoundedCard'

// TODO: discuss about wrapping the library and export it with this change
Big.NE = -30

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
  staking: {
    marginBottom: theme.spacing(2),
  },
  stepperContainer: {
    margin: theme.spacing(3, 0),
    width: '100%',
  },
  progressContainer: {
    background: 'rgba(275, 275, 275, 0.8)',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
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
    const pricePerMB = new Big(planItem.pricePerGb).div(UNIT_PREFIX_POW2.KILO)
    prices.push(convertToWeiString(pricePerMB))
  })

  return {
    availableSizeMB: new Big(availableSizeGB)
      .mul(UNIT_PREFIX_POW2.KILO).toString(),
    periods,
    prices,
  }
}

const StorageSellPage = () => {
  const {
    state: {
      planItems, availableSize, peerId, system,
    },
    dispatch,
  } = useContext(StorageSellContext)

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

      const setOfferReceipt = await storageContract.setOffer(
        availableSizeMB,
        periods,
        prices,
        peerId,
        { from: account },
      )
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
    && system
    && peerId

  const endHandler = account
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
    <CenteredPageTemplate>
      <StakingCard
        className={classes.staking}
        balance="2048 RIF"
        onWithdrawFunds={() => { logger.info('withdraw action') }}
        onAddFunds={() => { logger.info('add funds action') }}
      />
      <Typography gutterBottom variant="h5" color="primary">List your storage service</Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        Fill out the fields below to list your storage service. All information provided is meant to be true and correct.
      </Typography>
      <RoundedCard color="primary" className={classes.stepperContainer}>
        <SellStepper endHandler={endHandler} />
      </RoundedCard>
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

export default StorageSellPage

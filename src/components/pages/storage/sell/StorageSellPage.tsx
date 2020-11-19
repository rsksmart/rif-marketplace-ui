import React, {
  useContext, useCallback, useState, useEffect,
} from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button as RUIButton, Web3Store } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { StorageContract } from 'contracts/storage'
import Logger from 'utils/Logger'
import { UIError } from 'models/UIMessage'
import Login from 'components/atoms/Login'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Big from 'big.js'
import AppContext, { errorReporterFactory } from 'context/App/AppContext'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import { AddTxPayload } from 'context/Blockchain/blockchainActions'
import BlockchainContext from 'context/Blockchain/BlockchainContext'
import { LoadingPayload } from 'context/App/appActions'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import EditOfferStepper from 'components/organisms/storage/sell/EditOfferStepper'
import RoundedCard from 'components/atoms/RoundedCard'
import { transformOfferDataForContract } from 'contracts/storage/utils'
import Staking from 'components/organisms/storage/staking/Staking'
import { SupportedTokens } from 'contracts/interfaces'

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
}))

const StorageSellPage = () => {
  const {
    state: {
      billingPlans, availableSize, peerId, system,
    },
    dispatch,
  } = useContext(OfferEditContext)

  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)
  const { dispatch: bcDispatch } = useContext(BlockchainContext)

  const { dispatch: appDispatch } = useContext(AppContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const [isPendingConfirm, setIsPendingConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const classes = useStyles()
  const history = useHistory()

  const handleSubmit = async (): Promise<void> => {
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
      })

      setIsProcessing(true)
      const storageContract = StorageContract.getInstance(web3)
      const {
        availableSizeMB, periods, prices, tokens,
      } = transformOfferDataForContract(availableSize, billingPlans)

      const setOfferReceipt = await storageContract.setOffer(
        availableSizeMB,
        periods,
        prices,
        tokens as SupportedTokens[],
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
        id: 'contract-storage',
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
      })
    }
  }

  const onProcessingComplete = (): void => {
    setIsProcessing(false)
  }

  useEffect(() => {
    if (isPendingConfirm && !isProcessing) {
      // Post-confirmations handle
      history.replace(ROUTES.STORAGE.SELL.DONE)
    }
  }, [isPendingConfirm, history, isProcessing])

  useEffect(() => (): void => {
    dispatch({
      type: 'CLEAN_UP',
      payload: {},
    })
  }, [dispatch])

  const isSubmitEnabled = billingPlans.length
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
      <Staking />
      <Typography gutterBottom variant="h5" color="primary">List your storage service</Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        Fill out the fields below to list your storage service. All the information provided is meant to be true and correct.
      </Typography>
      <RoundedCard color="primary" className={classes.stepperContainer}>
        <EditOfferStepper endHandler={endHandler} />
      </RoundedCard>
      {
        isProcessing
        && (
          <TransactionInProgressPanel
            {...{ isPendingConfirm, onProcessingComplete }}
            text="Listing your offer!"
            progMsg="The waiting period is required to securely list your storage offer.
             Please do not close this tab until the process has finished."
            overlayed
          />
        )
      }
    </CenteredPageTemplate>
  )
}

export default StorageSellPage

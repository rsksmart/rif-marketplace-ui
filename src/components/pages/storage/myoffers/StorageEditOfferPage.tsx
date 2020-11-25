import Typography from '@material-ui/core/Typography'
import { Button, Web3Store } from '@rsksmart/rif-ui'
import RoundedCard from 'components/atoms/RoundedCard'
import EditOfferStepper from 'components/organisms/storage/sell/EditOfferStepper'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import { LoadingPayload } from 'context/App/appActions'
import AppContext, { errorReporterFactory } from 'context/App/AppContext'
import { AddTxPayload } from 'context/Blockchain/blockchainActions'
import BlockchainContext from 'context/Blockchain/BlockchainContext'
import { OfferEditContextProps } from 'context/Market/storage/interfaces'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { StorageContract } from 'contracts/storage'
import { UIError } from 'models/UIMessage'
import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import { transformOfferDataForContract } from 'contracts/storage/utils'
import { SupportedTokens } from 'contracts/interfaces'
import { StorageOffer } from 'models/marketItems/StorageItem'

const logger = Logger.getInstance()

const StorageEditOfferPage: FC<{}> = () => {
  const history = useHistory()
  const {
    state: { account, web3 },
  } = useContext(Web3Store)
  const { dispatch: bcDispatch } = useContext(BlockchainContext)
  const { dispatch: appDispatch } = useContext(AppContext)
  const reportError = useCallback((e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch])
  const {
    state: {
      originalOffer, billingPlans, totalCapacity, peerId,
    },
  } = useContext<OfferEditContextProps>(OfferEditContext)

  if (!originalOffer || !account) {
    history.replace(ROUTES.STORAGE.MYOFFERS.BASE)
  }

  const [isPendingConfirm, setIsPendingConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleEditOffer = async () => {
    // without a web3 instance the submit action would be disabled
    if (!web3) return
    try {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Updating your offer...',
        } as LoadingPayload,
      } as any)

      setIsProcessing(true)
      const storageContract = StorageContract.getInstance(web3)

      const { subscriptionOptions } = originalOffer as StorageOffer
      const {
        totalCapacityMB, periods, prices, tokens,
      } = transformOfferDataForContract(
        totalCapacity,
        billingPlans,
        subscriptionOptions,
        // originalOffer,
      )

      const setOfferReceipt = await storageContract.setOffer(
        totalCapacityMB,
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
      } as any)
    }
  }

  const onProcessingComplete = (): void => {
    setIsProcessing(false)
  }

  useEffect(() => {
    if (isPendingConfirm && !isProcessing) {
      // Post-confirmations handle
      history.replace(ROUTES.STORAGE.MYOFFERS.EDIT.DONE)
    }
  }, [isPendingConfirm, history, isProcessing])

  const isSubmitEnabled = Boolean(billingPlans.length && totalCapacity)
  const endHandler = (
    <>
      <Button disabled={!isSubmitEnabled} color="primary" variant="contained" rounded onClick={handleEditOffer}>Edit offer</Button>
      {
        isSubmitEnabled
        && (
          <Typography
            gutterBottom
            color="secondary"
            variant="subtitle1"
            align="center"
          >
            {`Your wallet will open and you will be asked to confirm
             the transaction for listing your service.`}
          </Typography>
        )
      }
    </>
  )

  return (
    <CenteredPageTemplate
      title="Edit your storage offer"
      subtitle={`Fill out the fields below to edit your storage offer. 
      All the information provided is meant to be true and correct.`}
    >
      <RoundedCard color="primary">
        <EditOfferStepper endHandler={endHandler} />
      </RoundedCard>
      {
        isProcessing
        && (
          <TransactionInProgressPanel
            {...{ isPendingConfirm, onProcessingComplete }}
            text="Updating your offer!"
            progMsg="The waiting period is required to securely update your offer.
             Please do not close this tab until the process has finished."
            overlayed
          />
        )
      }
    </CenteredPageTemplate>
  )
}

export default StorageEditOfferPage

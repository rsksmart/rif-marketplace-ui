import Typography from '@material-ui/core/Typography'
import { Button, Web3Store } from '@rsksmart/rif-ui'
import RoundedCard from 'components/atoms/RoundedCard'
import EditOfferStepper from 'components/organisms/storage/sell/EditOfferStepper'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import { LoadingPayload } from 'context/App/appActions'
import AppContext, { errorReporterFactory } from 'context/App/AppContext'
import { AddTxPayload } from 'context/Blockchain/blockchainActions'
import BlockchainContext from 'context/Blockchain/BlockchainContext'
import { OfferEditContextProps, StorageBillingPlan, TokenAddressees } from 'context/Market/storage/interfaces'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import StorageContract from 'contracts/Storage'
import { PeriodInSeconds } from 'models/marketItems/StorageItem'
import { UIError } from 'models/UIMessage'
import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { convertToWeiString } from 'utils/parsers'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { Big } from 'big.js'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'

const logger = Logger.getInstance()

interface OfferContractData {
  availableSizeMB: string
  periods: number[][]
  prices: string[][]
  tokens: string[]
}

const transformOfferDataForContract = (
  availableSizeGB: number,
  billingPlans: StorageBillingPlan[],
): OfferContractData => ({
  availableSizeMB: new Big(availableSizeGB).mul(UNIT_PREFIX_POW2.KILO).toString(),
  ...billingPlans.reduce(
    (acc, { period, price, currency }) => {
      const tokenIndex = acc.tokens.findIndex(((t) => t === currency))
      const weiPrice = convertToWeiString(new Big(price).div(UNIT_PREFIX_POW2.KILO))

      if (tokenIndex !== -1) {
        acc.periods[tokenIndex].push(PeriodInSeconds[period])
        acc.prices[tokenIndex].push(weiPrice)
        return acc
      }

      return {
        prices: [...acc.prices, [weiPrice]],
        periods: [...acc.periods, [PeriodInSeconds[period]]],
        tokens: [...acc.tokens, TokenAddressees[currency]],
      }
    },
    { prices: [], periods: [], tokens: [] } as any,
  ),
})

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
      originalOffer, billingPlans, availableSize, peerId,
    },
  } = useContext<OfferEditContextProps>(OfferEditContext)

  if (!originalOffer || !account) {
    history.replace(ROUTES.STORAGE.MYOFFERS.BASE)
  }

  const [isPendingConfirm, setIsPendingConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // TODO: optimize to check what was edited and so send txs only to edit that info to save gas
  // this code is repeated in sell page but will change with the optimiization
  const handleEditOffer = async () => {
    // without a web3 instance the submit action would be disabled
    if (!web3) return
    try {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Editing your offer...',
        } as LoadingPayload,
      } as any)

      setIsProcessing(true)
      const storageContract = StorageContract.getInstance(web3)
      const {
        availableSizeMB, periods, prices, tokens,
      } = transformOfferDataForContract(availableSize, billingPlans)

      const setOfferReceipt = await storageContract.setOffer(
        availableSizeMB,
        periods,
        prices,
        tokens,
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
      history.replace(ROUTES.STORAGE.MYOFFERS.EDIT.DONE)
    }
  }, [isPendingConfirm, history, isProcessing])

  const isSubmitEnabled = !!(billingPlans.length && availableSize)
  const endHandler = (
    <>
      <Button disabled={!isSubmitEnabled} color="primary" variant="contained" rounded onClick={handleEditOffer}>Edit offer</Button>
      {
        isSubmitEnabled
        && (
          <Typography gutterBottom color="secondary" variant="subtitle1" align="center">
            Your wallet will open and you will be asked to confirm the transaction for listing your service.
          </Typography>
        )
      }
    </>
  )

  return (
    <CenteredPageTemplate
      title="Edit your storage offer"
      subtitle="Fill out the fields below to edit your storage offer. All information provided is meant to be true and correct."
    >
      <RoundedCard color="primary">
        <EditOfferStepper endHandler={endHandler} />
      </RoundedCard>
      {
        isProcessing
        && (
          <TransactionInProgressPanel
            {...{ isPendingConfirm, onProcessingComplete }}
            text="Editing your offer!"
            progMsg="The waiting period is required to securely list your offer.
             Please do not close this tab until the process has finished."
            overlayed
          />
        )
      }
    </CenteredPageTemplate>
  )
}

export default StorageEditOfferPage

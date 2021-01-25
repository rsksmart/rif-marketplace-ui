import { TransactionReceipt } from 'web3-eth'
import Typography from '@material-ui/core/Typography'
import { Button, Web3Store } from '@rsksmart/rif-ui'
import RoundedCard from 'components/atoms/RoundedCard'
import EditOfferStepper from 'components/organisms/storage/sell/EditOfferStepper'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import AppContext, { errorReporterFactory } from 'context/App/AppContext'
import { OfferEditContextProps } from 'context/Market/storage/interfaces'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { StorageContract } from 'contracts/storage'
import { UIError } from 'models/UIMessage'
import React, {
  FC, useCallback, useContext, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { transformOfferDataForContract } from 'contracts/storage/utils'
import { BillingPlan, StorageOffer } from 'models/marketItems/StorageItem'
import Web3 from 'web3'
import { isBillingPlansChange } from 'components/pages/storage/myoffers/utils'
import { NewRequestPayload } from 'context/Confirmations/interfaces'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import RoundBtn from 'components/atoms/RoundBtn'
import useConfirmations from 'hooks/useConfirmations'

const logger = Logger.getInstance()

const StorageEditOfferPage: FC<{}> = () => {
  const history = useHistory()
  const {
    state: { account, web3 },
  } = useContext(Web3Store)
  const { dispatch: appDispatch } = useContext(AppContext)
  const reportError = useCallback((e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch])
  const {
    state: {
      originalOffer, billingPlans, totalCapacity, peerId,
    },
  } = useContext<OfferEditContextProps>(OfferEditContext)
  const {
    dispatch: confirmationsDispatch,
  } = useContext<ConfirmationsContextProps>(ConfirmationsContext)

  if (!originalOffer || !account) {
    history.replace(ROUTES.STORAGE.MYOFFERS.BASE)
  }

  const currentConfs = useConfirmations(
    ['CANCEL_OFFER', 'EDIT_OFFER', 'NEW_OFFER'],
  )

  const [txIsDone, setTxIsDone] = useState(false)
  const [txIsInProgress, setTxIsInProgress] = useState(false)

  const isPlansChange = isBillingPlansChange(
    billingPlans as BillingPlan[],
    originalOffer?.subscriptionOptions as BillingPlan[] || [],
  )
  const isCapacityChange = originalOffer?.totalCapacityGB.toString() !== totalCapacity.toString()

  const makeUpdateOfferTx = (): Promise<TransactionReceipt> => {
    const storageContract = StorageContract.getInstance(web3 as Web3)

    const { subscriptionOptions } = originalOffer as StorageOffer
    const {
      totalCapacityMB, periods, prices, tokens,
    } = transformOfferDataForContract(
      totalCapacity,
      billingPlans,
      subscriptionOptions,
    )

    if (isCapacityChange && !isPlansChange) {
      return storageContract.setTotalCapacity(
        totalCapacityMB,
        { from: account },
      )
    }

    if (isPlansChange && !isCapacityChange) {
      return storageContract.setBillingPlans(
        periods,
        prices,
        tokens,
        { from: account },
      )
    }

    return storageContract.setOffer(
      totalCapacityMB,
      periods,
      prices,
      tokens,
      peerId,
      { from: account },
    )
  }

  const handleEditOffer = async (): Promise<void> => {
    try {
      setTxIsInProgress(true)
      const updateOfferReceipt = await makeUpdateOfferTx()
      logger.debug('updateOffer receipt: ', updateOfferReceipt)

      if (updateOfferReceipt) {
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'EDIT_OFFER',
            txHash: updateOfferReceipt.transactionHash,
          } as NewRequestPayload,
        })
        setTxIsDone(true)
      }
    } catch (error) {
      reportError(new UIError({
        error,
        id: 'contract-storage',
        text: 'Could not edit the offer in the contract.',
      }))
    } finally {
      setTxIsInProgress(false)
    }
  }

  const onProcessingComplete = (): void => {
    history.push(ROUTES.STORAGE.MYOFFERS.BASE)
  }

  const isSubmitEnabled = Boolean(billingPlans.length && totalCapacity
    && (isPlansChange || isCapacityChange))
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
        <EditOfferStepper
          isLoading={Boolean(currentConfs.length)}
          endHandler={endHandler}
        />
      </RoundedCard>
      <ProgressOverlay
        isDone={txIsDone}
        inProgress={txIsInProgress}
        title="Updating your storage offer"
        doneMsg="Your storage offer has been updated"
        buttons={[
          <RoundBtn
            onClick={onProcessingComplete}
          >
            Check your offer
          </RoundBtn>,
        ]}
      />
    </CenteredPageTemplate>
  )
}

export default StorageEditOfferPage

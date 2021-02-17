import Typography from '@material-ui/core/Typography'
import TableContainer from '@material-ui/core/TableContainer'
import {
  AgreementProviderView,
  AgreementView,
  createProviderItemFields,
} from 'components/organisms/storage/agreements/utils'
import Marketplace from 'components/templates/marketplace/Marketplace'
import MarketContext from 'context/Market'
import { Agreement } from 'models/marketItems/StorageItem'
import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import RoundBtn from 'components/atoms/RoundBtn'
import { Web3Store } from '@rsksmart/rif-ui'
import Logger from 'utils/Logger'
import Web3 from 'web3'
import AppContext, { errorReporterFactory } from 'context/App'
import { UIError } from 'models/UIMessage'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import { AgreementUpdateData } from 'context/Confirmations/interfaces'
import useConfirmations from 'hooks/useConfirmations'
import DetailsModal from '../agreements/DetailsModal'

export type ActiveContractsProps = {
  agreements: Agreement[]
}

const logger = Logger.getInstance()

const ActiveContracts: FC<ActiveContractsProps> = ({ agreements }) => {
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)
  const {
    state: { account, web3 },
  } = useContext(Web3Store)
  const { dispatch: appDispatch } = useContext(AppContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])
  const {
    dispatch: confirmationsDispatch,
  } = useContext<ConfirmationsContextProps>(ConfirmationsContext)

  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [
    itemDetails,
    setItemDetails,
  ] = useState<AgreementProviderView | undefined>(undefined)
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | undefined>(undefined)

  useEffect(() => {
    // hides modal on tx operation done
    if (txOperationDone && itemDetails) {
      setItemDetails(undefined)
    }
  }, [txOperationDone, itemDetails])

  const payoutConfirmations = useConfirmations(['AGREEMENT_PAYOUT'])

  if (!agreements.length) {
    return (
      <Typography
        align="center"
        color="secondary"
      >
        No active contracts yet
      </Typography>
    )
  }

  const onWithdraw = async (
    agreement: Agreement,
  ): Promise<void> => {
    try {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Withdrawing your funds...',
        },
      })

      setProcessingTx(true)
      const storageContract = (await import('contracts/storage'))
        .default
        .StorageContract
        .getInstance(web3 as Web3)

      const payoutFundsReceipt = await storageContract
        .payoutFunds(
          {
            creatorOfAgreement: agreement.consumer,
            dataReferences: [agreement.dataReference],
            token: agreement.paymentToken,
          },
          { from: account },
        )
      logger.debug('receipt: ', { payoutFundsReceipt })

      if (payoutFundsReceipt) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'AGREEMENT_PAYOUT',
            txHash: payoutFundsReceipt.transactionHash,
            contractActionData: {
              agreementId: agreement.id,
            } as AgreementUpdateData,
          },
        })
      }
    } catch (error) {
      logger.error('error withdrawing provider funds', error)
      reportError(new UIError({
        error,
        id: 'contract-storage',
        text: 'Could not withdraw your funds.',
      }))
    } finally {
      setProcessingTx(false)
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: false,
          id: 'contract',
        },
      })
    }
  }

  const handleTxCompletedClose = (): void => {
    setProcessingTx(false)
    setTxOperationDone(false)
    setItemDetails(undefined)
  }

  const items = createProviderItemFields(
    agreements,
    crypto,
    currentFiat,
    (_, agreement: Agreement) => {
      onWithdraw(agreement)
    },
    (_, agreementView: AgreementView, agreement: Agreement) => {
      setItemDetails(agreementView as AgreementProviderView)
      setSelectedAgreement(agreement)
    },
    payoutConfirmations,
  )

  const headers = {
    customer: 'Customer',
    contentSize: 'Content size',
    renewalDate: 'Renewal date',
    subscriptionPeriod: 'Subscription type',
    monthlyFee: 'Monthly fee',
    toBePayedOut: 'Available funds', // available funds to be paid to provider
    withdraw: '',
    view: '',
  }

  const actions = (): JSX.Element => (
    <RoundBtn
      disabled={Number(selectedAgreement?.toBePayedOut) <= 0}
      onClick={(): Promise<void> => onWithdraw(selectedAgreement as Agreement)}
    >
      Withdraw funds
    </RoundBtn>
  )

  return (
    <>
      <TableContainer>
        <Marketplace
          headers={headers}
          isLoading={false}
          items={items}
        />
      </TableContainer>
      <DetailsModal
        modalProps={{
          open: Boolean(itemDetails),
          onBackdropClick: (): void => setItemDetails(undefined),
          onEscapeKeyDown: (): void => setItemDetails(undefined),
        }}
        itemDetails={itemDetails}
        actions={actions}
      />
      <ProgressOverlay
        isDone={txOperationDone}
        doneMsg="Your funds have been withdrawn!"
        inProgress={processingTx}
        buttons={[
          <RoundBtn
            onClick={handleTxCompletedClose}
          >
            Close
          </RoundBtn>,
        ]}
        title="Withdrawing your funds"
      />
    </>
  )
}

export default ActiveContracts

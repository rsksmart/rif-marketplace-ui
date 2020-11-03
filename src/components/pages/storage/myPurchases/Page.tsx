import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import {
  makeStyles, TableContainer, Typography,
} from '@material-ui/core'
import RoundedCard from 'components/atoms/RoundedCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import Marketplace from 'components/templates/marketplace/Marketplace'
import MarketContext from 'context/Market/MarketContext'
import AgreementsContext, { AgreementContextProps } from 'context/Services/storage/agreements'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import {
  theme, Web3Store,
} from '@rsksmart/rif-ui'
import RoundBtn from 'components/atoms/RoundBtn'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { Agreement } from 'models/marketItems/StorageItem'
import DetailsModal from 'components/organisms/storage/agreements/DetailsModal'
import {
  AgreementView,
  AgreementCustomerView,
  createCustomerItemFields,
} from 'components/organisms/storage/agreements/utils'
import WithLoginCard from 'components/hoc/WithLoginCard'
import AppContext, { errorReporterFactory } from 'context/App/AppContext'
import { UIError } from 'models/UIMessage'
import { LoadingPayload } from 'context/App/appActions'
import { TokenAddressees } from 'context/Market/storage/interfaces'
import Web3 from 'web3'
import Logger from 'utils/Logger'
import ProgressOverlay from 'components/templates/ProgressOverlay'

const useTitleStyles = makeStyles(() => ({
  root: {
    marginBlockStart: `${theme.spacing(2)}px`,
    marginInlineStart: `${theme.spacing(2)}px`,
  },
}))

const logger = Logger.getInstance()

const MyStoragePurchases: FC = () => {
  const history = useHistory()
  const titleStyleClass = useTitleStyles()
  const {
    state: {
      agreements,
    },
    dispatch,
  } = useContext<AgreementContextProps>(AgreementsContext)
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

  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)

  const [
    itemDetails,
    setItemDetails,
  ] = useState<AgreementCustomerView | undefined>(undefined)
  const [
    selectedAgreement,
    setSelectedAgreement,
  ] = useState<Agreement | undefined>(undefined)

  useEffect(() => {
    if (account) {
      dispatch({
        type: 'SET_FILTERS',
        payload: { consumer: account },
      })
    }
  }, [account, dispatch])

  useEffect(() => {
    // hides modal on tx operation done
    if (txOperationDone && itemDetails) {
      setItemDetails(undefined)
    }
  }, [txOperationDone, itemDetails])

  const onWithdraw = async (agreement: Agreement): Promise<void> => {
    try {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Withdrawing your funds...',
        } as LoadingPayload,
      })
      setProcessingTx(true)
      const storageContract = (await import('contracts/storage/contract'))
        .default.getInstance(web3 as Web3)

      const withdrawFundsReceipt = await storageContract
        .withdrawFunds(
          {
            amounts: ['0'], // using 0 withdraws the max amount available
            dataReference: agreement.dataReference,
            provider: agreement.provider,
            tokens: [TokenAddressees[agreement.paymentToken]],
          },
          { from: account },
        )
      logger.debug('receipt: ', { withdrawFundsReceipt })

      if (withdrawFundsReceipt) {
        setTxOperationDone(true)
      }
    } catch (error) {
      logger.error('error withdrawing consumer funds', error)
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
        } as LoadingPayload,
      })
    }
  }

  const headers = {
    title: 'Title',
    provider: 'Provider',
    contentSize: 'Content size',
    renewalDate: 'Renewal date',
    subscriptionPeriod: 'Subscription type',
    monthlyFee: 'Monthly fee',
    renew: '',
    view: '',
  }

  const items = createCustomerItemFields(
    agreements,
    crypto,
    currentFiat,
    (_, agreement: Agreement) => {
      dispatch({
        type: 'SET_ORDER',
        payload: agreement,
      })
      history.push(ROUTES.STORAGE.MYPURCHASES.RENEW)
    },
    (_, agreementView: AgreementView, agreement: Agreement) => {
      setItemDetails(agreementView as AgreementCustomerView)
      setSelectedAgreement(agreement)
    },
  )

  const renderDetailsActions = (): JSX.Element => (
    <RoundBtn
      onClick={(): Promise<void> => onWithdraw(selectedAgreement as Agreement)}
    >
      Withdraw all funds
    </RoundBtn>
  )

  const handleTxCompletedClose = (): void => {
    setProcessingTx(false)
    setTxOperationDone(false)
    setItemDetails(undefined)
  }

  return (
    <CenteredPageTemplate>
      <RoundedCard color="secondary">
        <GridColumn>
          <GridItem>
            <Typography
              gutterBottom
              color="primary"
              variant="subtitle1"
              classes={titleStyleClass}
            >
              Active contracts
            </Typography>
          </GridItem>
          <GridItem>
            <TableContainer>
              <Marketplace
                headers={headers}
                isLoading={false}
                items={items}
              />
            </TableContainer>
          </GridItem>
        </GridColumn>
      </RoundedCard>

      <DetailsModal
        modalProps={{
          open: Boolean(itemDetails),
          onBackdropClick: (): void => setItemDetails(undefined),
          onEscapeKeyDown: (): void => setItemDetails(undefined),
        }}
        itemDetails={itemDetails}
        actions={renderDetailsActions}
      />
      <ProgressOverlay
        isDone={txOperationDone}
        doneMsg="Your funds have been withdrawed!"
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
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: MyStoragePurchases,
  title: 'Connect your wallet to see your purchases',
  contentText: 'Connect your wallet to get detailed information about your purchases',
})

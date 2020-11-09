import React, {
  FC, useContext, useEffect, useState,
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
import ProgressOverlay from 'components/templates/ProgressOverlay'
import withWithdrawContext, { StorageWithdrawContext, StorageWithdrawContextProps } from 'context/storage/mypurchases/withdraw'

const useTitleStyles = makeStyles(() => ({
  root: {
    marginBlockStart: `${theme.spacing(2)}px`,
    marginInlineStart: `${theme.spacing(2)}px`,
  },
}))

const MyStoragePurchases: FC = () => {
  const history = useHistory()
  const titleStyleClass = useTitleStyles()
  const {
    state: {
      agreements,
    },
    dispatch: agreementsDispatch,
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
    state: { account },
  } = useContext(Web3Store)

  const {
    state: {
      status: {
        inProgress, isDone,
      },
      agreement: selectedAgreement,
    },
    dispatch,
    asyncActions: {
      withdraw: withdrawAction,
    },
  } = useContext<StorageWithdrawContextProps>(StorageWithdrawContext)

  const [
    itemDetails,
    setItemDetails,
  ] = useState<AgreementCustomerView | undefined>(undefined)

  useEffect(() => {
    if (account) {
      agreementsDispatch({
        type: 'SET_FILTERS',
        payload: { consumer: account },
      })
    }
  }, [account, agreementsDispatch])

  useEffect(() => {
    // hides modal on tx operation done
    if (isDone && itemDetails) {
      setItemDetails(undefined)
    }
  }, [isDone, itemDetails])

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
      agreementsDispatch({
        type: 'SET_ORDER',
        payload: agreement,
      })
      history.push(ROUTES.STORAGE.MYPURCHASES.RENEW)
    },
    (_, agreementView: AgreementView, agreement: Agreement) => {
      setItemDetails(agreementView as AgreementCustomerView)
      dispatch({
        type: 'SET_AGREEMENT',
        payload: agreement,
      })
    },
  )

  const renderDetailsActions = (): JSX.Element => (
    <RoundBtn
      onClick={
        (): void => {
          dispatch({
            type: 'SET_AGREEMENT',
            payload: selectedAgreement as Agreement,
          })
          withdrawAction()
        }
      }
    >
      Withdraw all funds
    </RoundBtn>
  )

  const handleTxCompletedClose = (): void => {
    dispatch({
      type: 'SET_STATUS',
      payload: {
        inProgress: false,
      },
    })
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
        isDone={isDone}
        doneMsg="Your funds have been withdrawed!"
        inProgress={inProgress}
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

export default withWithdrawContext(
  WithLoginCard({
    WrappedComponent: MyStoragePurchases,
    title: 'Connect your wallet to see your purchases',
    contentText: 'Connect your wallet to get detailed information about your purchases',
  }),
)

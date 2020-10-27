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
import createItemFields, { AgreementView, AgreementConsumerView } from './utils'

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
    state: { account },
  } = useContext(Web3Store)

  const [
    itemDetails,
    setItemDetails,
  ] = useState<AgreementConsumerView | undefined>(undefined)

  useEffect(() => {
    if (account) {
      dispatch({
        type: 'SET_FILTERS',
        payload: { consumer: account },
      })
    }
  }, [account, dispatch])

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

  const items = createItemFields(
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
    (_, agreementView: AgreementView) => {
      setItemDetails(agreementView as AgreementConsumerView)
    },
    'Consumer',
  )

  const renderDetailsActions = (): JSX.Element => (
    <RoundBtn
      onClick={(): void => undefined}
    >
      Withdraw funds
    </RoundBtn>
  )

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
    </CenteredPageTemplate>
  )
}

export default MyStoragePurchases

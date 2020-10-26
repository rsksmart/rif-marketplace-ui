import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import {
  Grid,
  makeStyles, Modal, TableContainer, Typography,
} from '@material-ui/core'
import RoundedCard from 'components/atoms/RoundedCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import Marketplace from 'components/templates/marketplace/Marketplace'
import MarketContext from 'context/Market/MarketContext'
import AgreementsContext, { AgreementContextProps } from 'context/Services/storage/agreements'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import {
  ModalBody, ModalHeader, ModalTitle, theme, Web3Store,
} from '@rsksmart/rif-ui'
import RifCard from 'components/organisms/RifCard'
import RoundBtn from 'components/atoms/RoundBtn'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { Agreement } from 'models/marketItems/StorageItem'
import createItemFields, { AgreementView } from './utils'

const useTitleStyles = makeStyles(() => ({
  root: {
    marginBlockStart: `${theme.spacing(2)}px`,
    marginInlineStart: `${theme.spacing(2)}px`,
  },
}))

const useModalStyles = makeStyles(() => ({
  root: {
    display: 'contents',
    width: 'initial',
  },
  modalWidth: {
    width: 'initial',
  },
  itemDetails: {
    marginTop: `${theme.spacing(2)}px`,
  },
  itemName: {
    textAlign: 'right',
  },
}))

const MyStoragePurchases: FC = () => {
  const history = useHistory()
  const titleStyleClass = useTitleStyles()
  const modalCardStyleClasses = useModalStyles()
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
  ] = useState<AgreementView | undefined>(undefined)

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
      setItemDetails(agreementView)
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

      <Modal
        open={!!itemDetails}
        onBackdropClick={(): void => setItemDetails(undefined)}
        onEscapeKeyDown={(): void => setItemDetails(undefined)}
        title="Details"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <>
          <ModalBody className={modalCardStyleClasses.modalWidth}>
            <RifCard
              className={modalCardStyleClasses.root}
              Actions={renderDetailsActions}
            >
              <ModalHeader className={modalCardStyleClasses.modalWidth}>
                <ModalTitle>{itemDetails?.title}</ModalTitle>
              </ModalHeader>
              <GridColumn
                spacing={2}
                className={modalCardStyleClasses.itemDetails}
              >
                {itemDetails ? Object.keys(itemDetails)
                  .filter((k) => k !== 'title')
                  .map((key) => (
                    <Grid
                      key={key}
                      item
                      container
                      direction="row"
                      spacing={6}
                      xs={12}
                    >
                      <GridItem
                        xs={6}
                        className={modalCardStyleClasses.itemName}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          {key}
                        </Typography>
                      </GridItem>
                      <GridItem xs={6}>{itemDetails[key]}</GridItem>
                    </Grid>
                  )) : ''}
              </GridColumn>
            </RifCard>
          </ModalBody>
        </>
      </Modal>
    </CenteredPageTemplate>
  )
}

export default MyStoragePurchases

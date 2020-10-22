import React, { FC, useContext, useState } from 'react'
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
  ModalBody, ModalHeader, ModalTitle, theme,
} from '@rsksmart/rif-ui'
import RifCard from 'components/organisms/RifCard'
import RoundBtn from 'components/atoms/RoundBtn'
import { ConfigPurchaseCardDetails } from 'components/organisms/storage/buy/ConfigPurchaseCard'
import { Agreement } from 'models/marketItems/StorageItem'
import RifSelect from 'components/molecules/RifSelect'
import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import PlanOption from 'components/molecules/storage/buy/PlanOption'
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
  const titleStyleClass = useTitleStyles()
  const modalCardStyleClasses = useModalStyles()
  const {
    state: {
      agreements,
    },
  } = useContext<AgreementContextProps>(AgreementsContext)
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)

  const [
    itemDetails,
    setItemDetails,
  ] = useState<AgreementView | undefined>(undefined)

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

  // const setItemForRenewal = (agreement: Agreement) => {
  //   const orderConfigTB: ConfigPurchaseCardDetails = {
  //     'CONTENT SIZE': `${agreement.size.toPrecision(2)} MB`,
  //     'CURRENCY TO PAY': <RifSelect<string>
  //       id="currency"
  //       value={0}
  //       options={[tokenDisplayNames[agreement.paymentToken]]}
  //       disabled
  //     />,
  //     'SUBSCRIPTION PERIOD': <RifSelect<JSX.Element>
  //       id="plan"
  //       value={0}
  //       options={[<PlanOption
  //         plan={agreement.subscriptionPeriod}
  //         xr={{
  //           fiat: fiatName,
  //           rate: currentRate,
  //         }}
  //   />]}
  //       onChange={changePlanHandle}
  //     />,
  //     'PERIODS TO PREPAY': <TextField
  //       type="number"
  //       value={periodsCount.toString()}
  //       InputProps={{
  //         inputProps: { min: 1 },
  //       }}
  //       onChange={changePeriodCountHandle}
  //     />,
  //     'TOTAL PRICE': total && totalFiat ? (
  //       <CombinedPriceCell
  //         currency={token || ''}
  //         currencyFiat={fiatName}
  //         price={total.toFixed(18)}
  //         priceFiat={totalFiat}
  //         divider={<br />}
  //       />
  //     ) : null,
  //     'RENEWAL DATE': endDate,
  //   }
  // }

  const items = createItemFields(
    agreements,
    crypto,
    currentFiat,
    (_, id: string) => {
    },
    (_, agreementView: AgreementView) => {
      setItemDetails(agreementView)
    },
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

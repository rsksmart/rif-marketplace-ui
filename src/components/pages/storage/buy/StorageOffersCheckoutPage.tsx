import {
  makeStyles, Step, StepLabel, Stepper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  TextFieldProps, Typography,
} from '@material-ui/core'
import { Button, colors } from '@rsksmart/rif-ui'
import { SupportedTokens, tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import RoundedCard from 'components/atoms/RoundedCard'
import { CombinedPriceCell } from 'components/molecules'
import DropZone from 'components/molecules/DropZone'
import GridRow from 'components/molecules/storage/buy/GridRow'
import PlanOption from 'components/molecules/storage/buy/PlanOption'
import RifSelect from 'components/molecules/storage/buy/RifSelect'
import RifCard from 'components/organisms/RifCard'
import StorageOrderDescription from 'components/organisms/storage/buy/StorageOfferDescription'
import StoragePinTabs from 'components/organisms/storage/buy/StoragePinTabs'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import React, {
  ChangeEvent, useContext,
} from 'react'
import withCheckoutContext, { CheckoutContext, PinnedContent } from './CheckoutContext'

const pinTabUploader = (
  <>
    <GridItem xs={12}>
      <GridRow
        justify="space-evenly"
      >
        <GridItem>
          <TextField
            id="contentName"
            label="Content name"
            variant="outlined"
            required
          />
        </GridItem>
      </GridRow>
    </GridItem>
    <GridItem>
      <GridRow>
        <GridItem>
          <DropZone />
        </GridItem>
      </GridRow>
    </GridItem>
  </>
)

const pinTabHash = ({ name, size, hash }: {name: TextFieldProps, size: TextFieldProps, hash: TextFieldProps}) => (
  <>
    <GridItem>
      <Typography variant="body2">
        To ensure that your file persists in IPFS is necessary to pin it using its hash
      </Typography>
    </GridItem>
    <GridItem>
      <GridRow
        justify="space-evenly"
      >
        <GridItem>
          <TextField
            id="contentName"
            label="Content name"
            variant="outlined"
            {...name}
            required
          />
        </GridItem>
        <GridItem>
          <TextField
            id="contentSize"
            label="Content size"
            variant="outlined"
            {...size}
            required
          />
        </GridItem>
      </GridRow>
    </GridItem>
    <GridItem>
      <TextField
        id="hash"
        label="Hash"
        variant="outlined"
        required
        {...hash}
        style={{
          width: '100%',
        }}
      />
    </GridItem>
    <GridItem>
      <Typography variant="caption">
        You can find the hash of your file in your storage system (IPFS, SWARM)
      </Typography>
    </GridItem>
  </>
)

const useStyles = makeStyles(() => ({
  stepperCard: {
    display: 'flex',
    justifyContent: 'center',
  },
  contentDetails: {
    width: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  detailKey: {
    border: 'none',
  },
  detailValue: {
    border: 'none',
  },
}))

const StorageOffersCheckoutPage = () => {
  const classes = useStyles()
  const {
    state: {
      exchangeRates: {
        currentFiat: {
          displayName: fiatName,
        },
      },
    },
  } = useContext<MarketContextProps>(MarketContext)

  const {
    state: {
      order,
      auxiliary: {
        selectedCurrency,
        periodsCount,
        selectedPlan,
        currencyOptions,
        currentRate,
        currentToken,
        planOptions,
        requiresUpload,
      },
      pinned,
    },
    dispatch,
  } = useContext(CheckoutContext)

  const setPinned = (pinnedContent: Partial<PinnedContent>) => dispatch({
    type: 'SET_PINNED',
    payload: {
      ...pinnedContent,
    },
  })

  const {
    total,
    totalFiat,
    endDate,
  } = order

  const changeCurrencyHandle = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => dispatch({
    type: 'CHANGE_CURRENCY',
    payload: { index: value as number },
  })

  const changePlanHandle = ({
    target: { value },
  }: React.ChangeEvent<{
    name?: string
    value: unknown
  }>): void => dispatch({
    type: 'SET_AUXILIARY',
    payload: {
      selectedPlan: value as number,
    },
  })

  const changePeriodCountHandle = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const periodCount = parseInt(value, 10)
    dispatch({
      type: 'SET_AUXILIARY',
      payload: {
        periodsCount: periodCount || 0,
      },
    })
  }

  const currentPlanOptions = planOptions.map((plan) => (
    <PlanOption
      key={Object.entries(plan).toLocaleString()}
      plan={plan}
      xr={{
        fiat: fiatName,
        rate: currentRate,
      }}
    />
  ))

  const orderConfigTB = pinned && {
    'CONTENT SIZE': pinned.size?.replace(/[a-zA-Z]+/g, ''),
    'CURRENCY TO PAY': <RifSelect<string>
      id="currency"
      value={selectedCurrency}
      options={currencyOptions
        .map((symbol: SupportedTokens) => tokenDisplayNames[symbol])}
      onChange={changeCurrencyHandle}
      disabled={currencyOptions.length <= 1}
    />,
    'SUBSCRIPTION PERIOD': <RifSelect<JSX.Element>
      id="plan"
      value={selectedPlan}
      options={currentPlanOptions}
      onChange={changePlanHandle}
    />,
    'PERIODS TO PREPAY': <TextField
      type="number"
      value={periodsCount}
      inputProps={{
        min: 0,
      }}
      onChange={changePeriodCountHandle}
    />,
    'TOTAL PRICE': total && totalFiat ? (
      <CombinedPriceCell
        currency={currentToken || ''}
        currencyFiat={fiatName}
        price={total}
        priceFiat={totalFiat}
        divider=" "
      />
    ) : '',
    'RENEWAL DATE': endDate,
  }

  const handlePinTypeChange = (
    _: React.ChangeEvent<{}>, value: number,
  ): void => dispatch({
    type: 'SET_AUXILIARY',
    payload: {
      requiresUpload: Boolean(value),
    },
  })

  // const planConfiguration = () => (
  //   <GridColumn alignContent="center">
  //     <Typography variant="caption">To buy your storage you have to select the currency, suscription and payment details to get the final price of your storage plan.</Typography>
  //   </GridColumn>
  // )

  return (
    <CheckoutPageTemplate
      className="storage-checkout-page"
      backButtonProps={{
        backTo: 'offers',
      }}
    >
      <GridColumn
        className="rootContainer"
      >
        {order && pinned && <StorageOrderDescription order={{ ...order, ...pinned }} />}

        {/* STEPPER */}
        <GridItem>
          <GridRow justify="center">
            <GridItem xs={10}>
              <RoundedCard
                color="primary"
                className={classes.stepperCard}
              >
                <Stepper
                  activeStep={Number(Boolean(pinned?.hash))}
                  alternativeLabel
                >
                  <Step>
                    <StepLabel>Upload/Pin content</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Configure your storage plan</StepLabel>
                  </Step>
                </Stepper>
              </RoundedCard>
            </GridItem>
          </GridRow>
        </GridItem>
        {/* CONTENT */}
        {/* { Number(Boolean(order?.contentHash)) ? planConfiguration() : pinnedContentSelector()} */}
        <GridItem style={{ alignSelf: 'center' }}>
          <Typography variant="caption">To buy your storage you have to select the currency, suscription and payment details to get the final price of your storage plan.</Typography>
        </GridItem>
        <GridItem>
          <GridColumn alignContent="center">
            <GridItem>
              <RifCard
                Header={
                  pinned?.hash
                    ? () => (
                      <Typography variant="h6" color="primary">Configuring storage plan</Typography>
                    )
                    : () => (
                      <StoragePinTabs
                        value={Number(requiresUpload)}
                        onChange={handlePinTypeChange}
                      />
                    )
}
                Actions={
                  pinned?.hash
                    ? () => (
                      <Button
                        style={{
                          background: colors.primary,
                          color: colors.gray1,
                        }}
                        onClick={(event) => {
                          // Validate input

                          // Submit
                        }}
                      >
                        Buy

                      </Button>
                    )
                    : () => (
                      <Button
                        style={{
                          background: colors.primary,
                          color: colors.gray1,
                        }}
                        onClick={(event) => {
                          // Validate input

                          // Submit
                        }}
                      >
                        {requiresUpload ? 'Pin' : 'Upload'}
                      </Button>
                    )
}
              >
                <GridColumn
                  justify="space-evenly"
                >
                  {orderConfigTB
                    ? (
                      <Table className={classes.contentDetails}>
                        <TableBody>
                          {Object.keys(orderConfigTB).map((key) => (
                            <TableRow key={key}>
                              <TableCell className={classes.detailKey}><Typography variant="body2">{key}</Typography></TableCell>
                              <TableCell className={classes.detailValue}>{orderConfigTB[key]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )
                    : requiresUpload ? pinTabHash({
                      name: {
                        value: pinned?.name,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setPinned({ name: event.target.value }),
                      },
                      size: {
                        value: pinned?.size,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setPinned({ size: event.target.value }),
                      },
                      hash: {
                        value: pinned?.hash,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setPinned({ hash: event.target.value }),
                      },
                    }) : pinTabUploader}
                </GridColumn>
              </RifCard>
            </GridItem>
          </GridColumn>
        </GridItem>
      </GridColumn>
    </CheckoutPageTemplate>
  )
}
export default withCheckoutContext(StorageOffersCheckoutPage)

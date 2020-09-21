import {
  Box, makeStyles, Step, StepLabel, Stepper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  TextFieldProps, Typography,
} from '@material-ui/core'
import { Button, colors } from '@rsksmart/rif-ui'
import React, {
  ChangeEvent, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import { SupportedTokens, tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import RoundedCard from 'components/atoms/RoundedCard'
import { CombinedPriceCell } from 'components/molecules'
import DropZone from 'components/molecules/DropZone'
import GridRow from 'components/molecules/storage/buy/GridRow'
import LabelWithValue from 'components/molecules/storage/buy/LabelWithValue'
import PlanOption from 'components/molecules/storage/buy/PlanOption'
import RifSelect from 'components/molecules/storage/buy/RifSelect'
import RifCard from 'components/organisms/RifCard'
import StoragePinTabs from 'components/organisms/storage/buy/StoragePinTabs'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import { OrderPayload } from 'context/Services/storage/offersActions'
import StorageOffersContext from 'context/Services/storage/OffersContext'
import { PeriodInSeconds, StorageOffer } from 'models/marketItems/StorageItem'
import ROUTES from 'routes'

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
  const history = useHistory()
  const {
    state: {
      order,
      listing,
    },
    dispatch,
  } = useContext(StorageOffersContext)
  const {
    state: {
      exchangeRates: {
        currentFiat: {
          displayName: fiatName,
        },
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)

  // const listing: OffersListing = {
  //   items: [
  //     {
  //       id: '0x01',
  //       location: 'UK',
  //       system: 'IPFS',
  //       availableSizeGB: new Big(10),
  //       averagePrice: 1,
  //       subscriptionOptions: [
  //         {
  //           period: 'Daily',
  //           price: new Big(1),
  //           currency: 'rbtc',
  //         },
  //         {
  //           period: 'Monthly',
  //           price: new Big(30),
  //           currency: 'rbtc',
  //         },
  //         {
  //           period: 'Daily',
  //           price: new Big(1),
  //           currency: 'rif',
  //         },
  //       ],
  //     },
  //   ],
  // }
  // const order: StorageOrder = {
  //   item: {
  //     id: '0x01',
  //     location: 'UK',
  //     system: 'IPFS',
  //     availableSizeGB: new Big(10),
  //     averagePrice: 1,
  //   },
  //   contentHash: '0xFACEOFF',
  //   contentName: 'TEST NAME',
  //   contentSize: '19MB',
  //   isProcessing: false,
  // }

  const currentOffer: StorageOffer | undefined = listing.items.find((offer: StorageOffer) => offer.id === order?.item.id)

  const availableTokens = Array.from(
    new Set(
      currentOffer?.subscriptionOptions.map(
        (option) => option.currency
        ),
    ),
  )

  const [currentCurrencyOption, setCurrentCurrencyOption] = useState(0)
  const [currentPlanOption, setCurrentPlanOption] = useState(0)
  const [currentPeriodsCount, setCurrentPeriodsCount] = useState(0)
  const [currentTotal, setCurrentTotal] = useState('')
  const [currentTotalFiat, setCurrentTotalFiat] = useState('')
  const [currentEndDate, setCurrentEndDate] = useState('')

  const currentToken = availableTokens[currentCurrencyOption]
  const currentRate = crypto[currentToken]?.rate

  const changeCurrencyHandle = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setCurrentCurrencyOption(value as number)
    setCurrentPlanOption(0)
    setCurrentPeriodsCount(0)
  }
  const changePlanHandle = ({
    target: { value },
  }: React.ChangeEvent<{
    name?: string
    value: unknown
  }>): void => setCurrentPlanOption(value as number)
  const changePeriodCountHandle = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const periodCount = parseInt(value, 10)
    setCurrentPeriodsCount(periodCount || 0)
  }

  const planOptions = currentOffer?.subscriptionOptions
    .filter((plan) => plan.currency === currentToken)
    .map((plan) => (
      <PlanOption
        key={Object.entries(plan).toLocaleString()}
        plan={plan}
        xr={{
          fiat: fiatName,
          rate: currentRate,
        }}
      />
    ))

  const details = order && {
    'CONTENT SIZE': order.contentSize?.replace(/[a-zA-Z]+/g, ''),
    'CURRENCY TO PAY': <RifSelect<string>
      id="currency"
      value={currentCurrencyOption}
      options={availableTokens.map((symbol: SupportedTokens) => tokenDisplayNames[symbol])}
      onChange={changeCurrencyHandle}
      disabled={availableTokens.length <= 1}
    />,
    'SUBSCRIPTION PERIOD': <RifSelect<JSX.Element>
      id="plan"
      value={currentPlanOption}
      options={planOptions}
      onChange={changePlanHandle}
    />,
    'PERIODS TO PREPAY': <TextField
      type="number"
      value={currentPeriodsCount}
      inputProps={{
        min: 0,
      }}
      onChange={changePeriodCountHandle}
    />,
    'TOTAL PRICE': currentTotal && currentTotalFiat ? (
      <CombinedPriceCell
        currency={currentToken}
        currencyFiat={fiatName}
        price={currentTotal}
        priceFiat={currentTotalFiat}
        divider=" "
      />
    ) : '',
    'RENEWAL DATE': currentEndDate,
  }

  const [pinType, setPinType] = useState(0)
  const [contentName, setContentName] = useState('')
  const [contentSize, setContentSize] = useState('')
  const [contentHash, setContentHash] = useState('')

  const handlePinTypeChange = (
    _: React.ChangeEvent<{}>, value: number,
  ): void => setPinType(value)

  // const planConfiguration = () => (
  //   <GridColumn alignContent="center">
  //     <Typography variant="caption">To buy your storage you have to select the currency, suscription and payment details to get the final price of your storage plan.</Typography>
  //   </GridColumn>
  // )

  useEffect(() => {
    const currentPlan = currentOffer?.subscriptionOptions[currentPlanOption]

    if (currentPlan) {
      const total = currentPlan.price.mul(currentPeriodsCount)
      const totalFiat = total.mul(currentRate)
      const currentPeriodsInSec = PeriodInSeconds[currentPlan.period] * currentPeriodsCount
      const dateNow = new Date(Date.now())
      const endDate = new Date(dateNow.setSeconds(dateNow.getSeconds() + currentPeriodsInSec)).toLocaleDateString()

      setCurrentTotal(total.toString())
      setCurrentTotalFiat(totalFiat.toString())
      setCurrentEndDate(endDate)
    }
  }, [
    currentPlanOption,
    currentPeriodsCount,
    currentOffer,
    currentRate,
  ])

  if (!order) {
    history.replace(ROUTES.STORAGE.BUY.BASE)
    return null
  }

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
        {/* DESCRIPTION */}
        <GridRow>
          <GridItem>
            <LabelWithValue
              label="Selected storage provider"
              value={order?.item.id}
            />
          </GridItem>
          <GridItem>
            <LabelWithValue
              label="System"
              value={order?.item.system}
            />
          </GridItem>
        </GridRow>
        {pinType ? (
          <GridRow>
            <GridItem>
              <Typography color="textPrimary" component="div">
                <Box display="inline" fontWeight="fontWeightMedium">
                  The size of your storage plan is calculated by the content that you upload/persist in this first step.
                </Box>
              </Typography>
            </GridItem>
          </GridRow>
        ) : ''}
        {/* STEPPER */}
        <GridItem>
          <GridRow justify="center">
            <GridItem xs={10}>
              <RoundedCard
                color="primary"
                className={classes.stepperCard}
              >
                <Stepper
                  activeStep={Number(Boolean(order?.contentHash))}
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
        <GridItem>
          <GridColumn alignContent="center">
            <GridItem>
              <RifCard
                Header={
                  order?.contentHash
                    ? () => (
                      <Typography variant="h6" color="primary">Configuring storage plan</Typography>
                    )
                    : () => (
                      <StoragePinTabs
                        value={pinType}
                        onChange={handlePinTypeChange}
                      />
                    )
}
                Actions={
                  order?.contentHash
                    ? () => (
                      <Button
                        style={{
                          background: colors.primary,
                          color: colors.gray1,
                        }}
                        onClick={(event) => {
                          // Validate input

                          // Submit
                          dispatch({
                            type: 'SET_ORDER',
                            payload: {
                              item: order?.item,
                              contentName,
                              contentSize,
                              contentHash,
                            } as OrderPayload,
                          })
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
                          dispatch({
                            type: 'SET_ORDER',
                            payload: {
                              item: order?.item,
                              contentName,
                              contentSize,
                              contentHash,
                            } as OrderPayload,
                          })
                        }}
                      >
                        {pinType ? 'Pin' : 'Upload'}
                      </Button>
                    )
}
              >
                <GridColumn
                  justify="space-evenly"
                >
                  {order?.contentHash
                    ? (
                      <Table className={classes.contentDetails}>
                        <TableBody>
                          {Object.keys(details).map((key) => (
                            <TableRow key={key}>
                              <TableCell className={classes.detailKey}><Typography variant="body2">{key}</Typography></TableCell>
                              <TableCell className={classes.detailValue}>{details[key]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  )
                    : pinType ? pinTabHash({
                      name: {
                        value: contentName,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setContentName(event.target.value),
                      },
                      size: {
                        value: contentSize,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setContentSize(event.target.value),
                      },
                      hash: {
                        value: contentHash,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setContentHash(event.target.value),
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
export default StorageOffersCheckoutPage

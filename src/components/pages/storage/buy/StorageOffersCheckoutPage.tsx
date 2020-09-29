import {
  makeStyles, Step, StepLabel, Stepper,
  Theme,
  TextField,
  Typography,
} from '@material-ui/core'
import { SupportedTokens, tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import RoundedCard from 'components/atoms/RoundedCard'
import { CombinedPriceCell } from 'components/molecules'
import GridRow from 'components/molecules/storage/buy/GridRow'
import PlanOption from 'components/molecules/storage/buy/PlanOption'
import RifSelect from 'components/molecules/storage/buy/RifSelect'
import ConfigPurchaseCard from 'components/organisms/storage/buy/ConfigPurchaseCard'
import PinningCard from 'components/organisms/storage/buy/PinningCard'
import StorageOrderDescription from 'components/organisms/storage/buy/StorageOfferDescription'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import React, {
  ChangeEvent, FC, useContext,
} from 'react'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import withCheckoutContext, { CheckoutContext } from './CheckoutContext'

const useStyles = makeStyles((theme: Theme) => ({
  stepperCard: {
    display: 'flex',
    justifyContent: 'center',
  },
  disclaimer: {
    alignSelf: 'center',
    marginBottom: theme.spacing(3),
  },
}))

const StorageOffersCheckoutPage: FC = () => {
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
        planOptions,
        totalFiat,
        endDate,
      },
      pinned,
    },
    dispatch,
  } = useContext(CheckoutContext)

  const {
    token,
    total,
  } = order

  const changeCurrencyHandle = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => dispatch({
    type: 'CHANGE_CURRENCY',
    payload: { index: value as number },
  })

  const changePlanHandle = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown}>): void => dispatch({
    type: 'SET_AUXILIARY',
    payload: {
      selectedPlan: value as number,
    },
  })

  const changePeriodCountHandle = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => dispatch({
    type: 'SET_AUXILIARY',
    payload: {
      periodsCount: parseInt(value, 10) || 0,
    },
  })

  const renderPlanOptions = planOptions.map((plan) => (
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
    'CONTENT SIZE': `${pinned.size?.replace(/[a-zA-Z]+/g, '')} ${UNIT_PREFIX_POW2[pinned.unit][0]}B`,
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
      options={renderPlanOptions}
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
        currency={token || ''}
        currencyFiat={fiatName}
        price={total}
        priceFiat={totalFiat}
        divider=" "
      />
    ) : '',
    'RENEWAL DATE': endDate,
  }

  return (
    <CheckoutPageTemplate
      className="storage-checkout-page"
      backButtonProps={{
        backTo: 'offers',
      }}
    >
      <GridColumn>
        <GridItem>
          {order && pinned && <StorageOrderDescription order={{ ...order, ...pinned }} />}
        </GridItem>
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
        <GridItem className={classes.disclaimer}>
          <Typography variant="caption" color="secondary">To buy your storage you have to select the currency, suscription and payment details to get the final price of your storage plan.</Typography>
        </GridItem>
        <GridItem>
          <GridColumn alignContent="center">
            <GridItem>
              {pinned && orderConfigTB && (
                <ConfigPurchaseCard details={orderConfigTB} />
              )}
              {!pinned && (
                <PinningCard dispatch={dispatch} />
              )}
            </GridItem>
          </GridColumn>
        </GridItem>
      </GridColumn>
    </CheckoutPageTemplate>
  )
}
export default withCheckoutContext(StorageOffersCheckoutPage)

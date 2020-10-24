import React, {
  ChangeEvent, FC, useContext,
} from 'react'
import { useHistory } from 'react-router-dom'
import {
  makeStyles, Step, StepLabel, Stepper,

  TextField, Theme,

  Typography,
} from '@material-ui/core'
import { SupportedToken, tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import RoundedCard from 'components/atoms/RoundedCard'
import { CombinedPriceCell } from 'components/molecules'
import RifSelect from 'components/molecules/RifSelect'
import PlanOption from 'components/molecules/storage/buy/PlanOption'
import PinningCard from 'components/organisms/storage/buy/PinningCard'
import StorageOrderDescription from 'components/organisms/storage/buy/StorageOfferDescription'
import StoragePurchaseCard, { StoragePurchaseCardDetails } from 'components/organisms/storage/buy/StoragePurchaseCard'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import withCheckoutContext, { ContextProps, initialState, StorageCheckoutContext } from 'context/storage/buy/checkout'
import ROUTES from 'routes'
import { UNIT_PREFIX_POW2 } from 'utils/utils'

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
  const history = useHistory()
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
      status,
    },
    dispatch,
  } = useContext<ContextProps>(StorageCheckoutContext)

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
      periodsCount: parseInt(value, 10) || initialState.auxiliary.periodsCount,
    },
  })

  const subscriptionOptions = planOptions.map((plan) => (
    <PlanOption
      key={Object.entries(plan).toLocaleString()}
      plan={plan}
      xr={{
        fiat: fiatName,
        rate: currentRate,
      }}
    />
  ))
  const orderConfigTB: StoragePurchaseCardDetails | undefined = pinned && {
    'CONTENT SIZE': `${pinned.size?.replace(/[a-zA-Z]+/g, '')} ${UNIT_PREFIX_POW2[pinned.unit][0]}B`,
    'CURRENCY TO PAY': <RifSelect<string>
      id="currency"
      value={selectedCurrency}
      options={currencyOptions
        .map((symbol: SupportedToken) => tokenDisplayNames[symbol])}
      onChange={changeCurrencyHandle}
      disabled={currencyOptions.length <= 1}
    />,
    'SUBSCRIPTION PERIOD': <RifSelect<JSX.Element>
      id="plan"
      value={selectedPlan}
      options={subscriptionOptions}
      onChange={changePlanHandle}
    />,
    'PERIODS TO PREPAY': <TextField
      type="number"
      value={periodsCount.toString()}
      InputProps={{
        inputProps: { min: 1 },
      }}
      onChange={changePeriodCountHandle}
    />,
    'TOTAL PRICE': total && totalFiat ? (
      <CombinedPriceCell
        currency={token || ''}
        currencyFiat={fiatName}
        price={total.toFixed(18)}
        priceFiat={totalFiat}
        divider={<br />}
      />
    ) : null,
    'RENEWAL DATE': endDate,
  }

  const renderStepper = (): JSX.Element => (
    <>
      <GridItem>
        <GridRow
          alignItems="baseline"
          wrap="nowrap"
          style={{
            paddingBlockEnd: '1.5em',
          }}
          spacing={5}
          justify="center"
        >
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
                  <StepLabel>Upload/Pin Content</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Configure your storage plan</StepLabel>
                </Step>
              </Stepper>
            </RoundedCard>
          </GridItem>
        </GridRow>
      </GridItem>
    </>
  )

  const renderContent = (): JSX.Element => (
    <>
      <GridItem className={classes.disclaimer}>
        <Typography variant="caption" color="secondary">You have to select the currency, subscription, and payment details to get the final price of your storage plan.</Typography>
      </GridItem>
      <GridItem>
        <GridColumn alignContent="center">
          <GridItem>
            {pinned && orderConfigTB && (
            <StoragePurchaseCard details={orderConfigTB} />
            )}
            {!pinned && (
            <PinningCard dispatch={dispatch} />
            )}
          </GridItem>
        </GridColumn>
      </GridItem>
    </>
  )

  const navToMyPurchases = (): void => history.replace(
    ROUTES.STORAGE.MYPURCHASES.BASE,
  )
  const navToStorageBase = (): void => history.replace(
    ROUTES.STORAGE.BUY.BASE,
  )

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
        { renderStepper() }
        {/* CONTENT */}
        { renderContent() }
      </GridColumn>
      <ProgressOverlay
        title="Creating agreement!"
        {...status}
        buttons={[
          {
            children: 'View my purchases',
            onClick: navToMyPurchases,
          },
          {
            children: 'View storage listing',
            onClick: navToStorageBase,
          },
        ]}
      />
    </CheckoutPageTemplate>
  )
}
export default withCheckoutContext(StorageOffersCheckoutPage)

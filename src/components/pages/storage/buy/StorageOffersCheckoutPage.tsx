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
import { CombinedPriceCell, JobDoneBox } from 'components/molecules'
import PlanOption from 'components/molecules/storage/buy/PlanOption'
import RifSelect from 'components/molecules/RifSelect'
import ConfigPurchaseCard from 'components/organisms/storage/buy/ConfigPurchaseCard'
import PinningCard from 'components/organisms/storage/buy/PinningCard'
import StorageOrderDescription from 'components/organisms/storage/buy/StorageOfferDescription'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import React, {
  ChangeEvent, FC, useContext,
} from 'react'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import GridRow from 'components/atoms/GridRow'
import RoundBtn from 'components/atoms/RoundBtn'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import withCheckoutContext, { CheckoutContext, Props as ContextProps, initialState } from './CheckoutContext'

const useStyles = makeStyles((theme: Theme) => ({
  stepperCard: {
    display: 'flex',
    justifyContent: 'center',
  },
  disclaimer: {
    alignSelf: 'center',
    marginBottom: theme.spacing(3),
  },
  progressContainer: {
    background: 'rgba(275, 275, 275, 0.8)',
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed',
    width: '100vw',
    top: 0,
    left: 0,
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
      status: {
        inProgress,
        isDone,
      },
    },
    dispatch,
  } = useContext<ContextProps>(CheckoutContext)

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
        divider={<br /> as any}
      />
    ) : '',
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
    </>
  )

  const renderContent = (): JSX.Element => (
    <>
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
    </>
  )

  const renderProgressOverlay = (): JSX.Element | null => {
    if (inProgress || isDone) {
      return (
        <div className={classes.progressContainer}>
          {
            inProgress && (
            <TransactionInProgressPanel
              text="Creating agreement!"
              progMsg="The waiting period is required to securely list your offer.
              Please do not close this tab until the process has finished."
            />
            )
          }
          {
            isDone && (
            <TxCompletePageTemplate>
              <JobDoneBox text="Your offer agreement has been created." />
              <GridRow justify="center">
                <GridItem>
                  <RoundBtn
                    onClick={(): void => { history.replace(ROUTES.STORAGE.MYPURCHASES.BASE) }}
                  >
                    View my purchases
                  </RoundBtn>
                </GridItem>
                <GridItem>
                  <RoundBtn
                    onClick={(): void => { history.replace(ROUTES.STORAGE.BUY.BASE) }}
                  >
                    View storage listing
                  </RoundBtn>
                </GridItem>
              </GridRow>
            </TxCompletePageTemplate>
            )
          }
        </div>
      )
    }
    return null
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
        { renderStepper() }
        {/* CONTENT */}
        { renderContent() }
      </GridColumn>
      {renderProgressOverlay()}
    </CheckoutPageTemplate>
  )
}
export default withCheckoutContext(StorageOffersCheckoutPage)

import React, { FC, useContext, useState } from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { Button } from '@rsksmart/rif-ui'
import { SYSTEM_SUPPORTED_FIAT } from 'models/Fiat'
import { QuotationPerToken } from 'models/Market'
import MarketContext from 'context/Market'
import { OffersOrder } from 'context/Services/notifier/offers/interfaces'
import CheckoutPayment from './CheckoutPayment'
import EventsRegistrar from './EventsRegistrar'

type Props = {
  order: OffersOrder
  onBuy: () => void
}

const getExpirationDate = (daysLeft: number): Date => {
  const retDate = new Date()
  retDate.setDate(retDate.getDate() + daysLeft)
  return retDate
}

const CheckoutStepper: FC<Props> = ({ onBuy, order }) => {
  const [activeStep, setActiveStep] = useState(0)
  const {
    state: {
      exchangeRates: {
        crypto: cryptoXRs,
      },
    },
  } = useContext(MarketContext)

  const {
    item: {
      token,
      value: tokenValue,
      daysLeft,
    },
  } = order

  const handleNext = (): void => setActiveStep(1)
  const handleBack = (): void => setActiveStep(0)

  const paymentOptions: QuotationPerToken = {} as QuotationPerToken
  paymentOptions[token.symbol] = tokenValue
  // FIXME: now we are only receiving a single quotation, need to check the need of this
  // two options:
  // 1 - allow to proceed in the list without selecting a currency
  // 2 - change the model we are using when selecting the order
  // TODO: after solving the previous issue QuotationPerToken and PriceOption(src/models/marketItems/NotifierItem.ts) types should be combined into the same one
  const expirationDate = getExpirationDate(daysLeft)

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        <StepLabel>Notification events</StepLabel>
        <StepContent>
          <EventsRegistrar onNext={handleNext} order={order} />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Payment</StepLabel>
        <StepContent>
          <CheckoutPayment
            onBuy={onBuy}
            paymentOptions={paymentOptions}
            fiatUnit={SYSTEM_SUPPORTED_FIAT.usd}
            expirationDate={expirationDate}
            cryptoXRs={cryptoXRs}
          />
          <Button
            onClick={handleBack}
            variant="outlined"
            color="secondary"
            rounded
          >
            Back
          </Button>
        </StepContent>
      </Step>
    </Stepper>
  )
}

export default CheckoutStepper

import React, { FC, useContext, useState } from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { Button } from '@rsksmart/rif-ui'
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
        currentFiat: { displayName: fiatDisplayName },
      },
    },
  } = useContext(MarketContext)

  const {
    item: {
      token: { symbol: tokenSymbol },
      value: tokenValue,
      daysLeft,
    },
  } = order

  const handleNext = (): void => setActiveStep(1)
  const handleBack = (): void => setActiveStep(0)

  const expirationDate = getExpirationDate(daysLeft)
  const tokenXR = cryptoXRs[tokenSymbol]

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
            fiatDisplayName={fiatDisplayName}
            expirationDate={expirationDate}
            cryptoPrice={tokenValue}
            tokenXR={tokenXR}
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

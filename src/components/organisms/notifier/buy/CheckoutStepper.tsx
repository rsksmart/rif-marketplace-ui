import React, { FC, useContext, useState } from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { Button } from '@rsksmart/rif-ui'
import RoundBtn from 'components/atoms/RoundBtn'
import { SYSTEM_SUPPORTED_FIAT } from 'models/Fiat'
import { QuotationPerToken } from 'models/Market'
import MarketContext from 'context/Market'
import Big from 'big.js'
import CheckoutPayment from './CheckoutPayment'

type Props = {
  onBuy: () => void
}

const CheckoutStepper: FC<Props> = ({ onBuy }) => {
  const [activeStep, setActiveStep] = useState(0)
  const {
    state: {
      exchangeRates: {
        crypto: cryptoXRs,
      },
    },
  } = useContext(MarketContext)

  const handleNext = (): void => setActiveStep(1)
  const handleBack = (): void => setActiveStep(0)
  // TODO: remove hardcoded
  const paymentOptions: QuotationPerToken = {
    rif: Big('100'),
    rbtc: Big('0.001'),
  }
  const expirationDate = new Date(2022, 1, 1)

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        {/* TODO: replace with content of pages/notifier/buy/NotifierOffersSelectedPage.tsx */}
        <StepLabel>Notification Channels</StepLabel>
        <StepContent>
          <p>Here goes the notificiation channels list.</p>
          <p>Users can create more here.</p>
          <br />
          <div>
            <RoundBtn onClick={handleNext}>
              Next
            </RoundBtn>
          </div>
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

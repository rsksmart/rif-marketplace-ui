import React, { FC, useState } from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { Button } from '@rsksmart/rif-ui'
import RoundBtn from 'components/atoms/RoundBtn'
import CheckoutPayment from './CheckoutPayment'

type Props = {
  onBuy: () => void
}

const CheckoutStepper: FC<Props> = ({ onBuy }) => {
  const [activeStep, setActiveStep] = useState(0)
  const handleNext = (): void => setActiveStep(1)
  const handleBack = (): void => setActiveStep(0)

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
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
          <CheckoutPayment onBuy={onBuy} />
          {/* <div> */}
          <Button
            onClick={handleBack}
            variant="outlined"
            color="secondary"
            rounded
          >
            Back
            </Button>
          {/* </div> */}
        </StepContent>
      </Step>
    </Stepper>
  )
}

export default CheckoutStepper

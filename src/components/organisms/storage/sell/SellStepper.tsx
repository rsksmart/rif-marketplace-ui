import React, {
  useState, useContext, ReactElement, FC,
} from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { Button } from '@rsksmart/rif-ui'
import { StorageListingContextProps } from 'context/Services/storage/interfaces'
import StorageListingContext from 'context/Services/storage/ListingContext'
import BaseSettings from './BaseSettings'
import PlanItemsList from './PlanItemsList'

export interface SellStepperProps {
  finalAction: ReactElement
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    margin: theme.spacing(2, 0),
  },
}))

const SellStepper: FC<SellStepperProps> = ({ finalAction }) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const { state: { availableSize, system, peerId } } = useContext<StorageListingContextProps>(StorageListingContext)

  const handleNext = () => {
    setActiveStep(1)
  }

  const handleBack = () => {
    setActiveStep(0)
  }

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        <StepLabel>General features</StepLabel>
        <StepContent>
          <div>
            <BaseSettings />
          </div>
          <div className={classes.actionsContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
              rounded
              disabled={!availableSize || !system || !peerId}
            >
              Next
            </Button>
          </div>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Define plans</StepLabel>
        <StepContent>
          <div><PlanItemsList /></div>
          <div className={classes.actionsContainer}>
            <div>
              <Button
                onClick={handleBack}
                className={classes.button}
                rounded
              >
                Back
              </Button>
              {finalAction}
            </div>
          </div>
        </StepContent>
      </Step>
    </Stepper>
  )
}

export default SellStepper

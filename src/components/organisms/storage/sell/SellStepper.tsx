import React, { useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import RoundedCard from 'components/atoms/RoundedCard'
import { Button } from '@rsksmart/rif-ui'
import BaseSettings from './BaseSettings'
import PlanItemsList from './PlanItemsList'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    margin: theme.spacing(2, 0),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}))

function getSteps() {
  return ['General features', 'Define plans']
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <BaseSettings />
    case 1:
      return <PlanItemsList />
    default:
      return 'Unknown step'
  }
}

const SellStepper = () => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(1)
  const steps = getSteps()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <RoundedCard className={classes.root} color="primary">
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <div>{getStepContent(index)}</div>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                    rounded
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                    rounded
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re ready to list your offer</Typography>
          <Button rounded onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </RoundedCard>
  )
}

export default SellStepper

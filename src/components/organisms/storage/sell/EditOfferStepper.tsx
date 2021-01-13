import Big from 'big.js'
import React, {
  useState, useContext, ReactElement, FC,
} from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { Button, validatedNumber, WithSpinner } from '@rsksmart/rif-ui'
import { OfferEditContextProps, StorageBillingPlan } from 'context/Market/storage/interfaces'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import {
  AddItemPayload, EditItemPayload, RemoveItemPayload, SetPeerIdPayload, SetTotalCapacityPayload,
} from 'context/Market/storage/offerEditActions'
import GeneralFeatures from './GeneralFeatures'
import BillingPlansList from './BillingPlansList'

export interface EditOfferStepperProps {
  endHandler: ReactElement
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

const EditOfferStepper: FC<EditOfferStepperProps> = ({ endHandler }) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const {
    state: {
      totalCapacity, system, peerId, originalOffer, billingPlans,
    },
    dispatch,
  } = useContext<OfferEditContextProps>(OfferEditContext)

  const handleNext = (): void => setActiveStep(1)
  const handleBack = (): void => setActiveStep(0)

  const handleSizeChange = (value: string): void => {
    dispatch({
      type: 'SET_TOTAL_CAPACITY',
      payload: {
        totalCapacity: Big(validatedNumber(Number(value))),
      } as SetTotalCapacityPayload,
    })
  }

  const handlePeerIdChange = (value: string): void => {
    dispatch({
      type: 'SET_PEER_ID',
      payload: {
        peerId: value,
      } as SetPeerIdPayload,
    })
  }

  const handleOnItemRemoved = (billingPlan: StorageBillingPlan): void => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: billingPlan as RemoveItemPayload,
    })
  }

  const handleItemAdded = (billingPlan: StorageBillingPlan): void => {
    dispatch({
      type: 'ADD_ITEM',
      payload: billingPlan as AddItemPayload,
    })
  }

  const handleItemSaved = (billingPlan: StorageBillingPlan): void => {
    dispatch(({
      type: 'EDIT_ITEM',
      payload: billingPlan as EditItemPayload,
    }))
  }

  const minCapacity = originalOffer?.utilizedCapacityGB.toNumber() || 0
  const totalCapacityNumber = totalCapacity.toNumber()
  const nextIsDisabled = !totalCapacityNumber
    || totalCapacityNumber <= minCapacity
    || !system
    || !peerId

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        <StepLabel>General features</StepLabel>
        <StepContent>
          <div>
            <GeneralFeatures
              originalOffer={originalOffer}
              peerId={peerId}
              totalCapacity={totalCapacity}
              system={system}
              onPeerIdChange={handlePeerIdChange}
              onSizeChange={handleSizeChange}
            />
          </div>
          <div className={classes.actionsContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
              rounded
              disabled={nextIsDisabled}
            >
              Next
            </Button>
          </div>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Define plans</StepLabel>
        <StepContent>
          <div>
            <BillingPlansList
              billingPlans={billingPlans}
              onItemRemoved={handleOnItemRemoved}
              onItemAdded={handleItemAdded}
              onItemSaved={handleItemSaved}
            />
          </div>
          <div className={classes.actionsContainer}>
            <div>
              <Button
                onClick={handleBack}
                className={classes.button}
                rounded
              >
                Back
              </Button>
              {endHandler}
            </div>
          </div>
        </StepContent>
      </Step>
    </Stepper>
  )
}

export default WithSpinner(EditOfferStepper)

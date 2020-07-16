import React, { FC, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { colors } from '@rsksmart/rif-ui'
import { makeStyles, Theme } from '@material-ui/core/styles';
import EditablePlan, { EditablePlanProps } from 'components/molecules/storage/listing/EditablePlan';
import PlanItem from 'components/molecules/storage/listing/PlanItem';
import { StoragePlan } from 'models/marketItems/StorageItem';
import { mayBePluralize } from 'utils/utils';
import PlanItemEditable from 'components/organisms/storage/listing/PlanItemEditable';

export interface PlanItemsProps { }

const useStyles = makeStyles((theme: Theme) => ({
  subscriptionCreator: {
    alignItems: 'center'
  },
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px'
  },
  storagePlans: {
    alignItems: 'center'
  }
}))

const PlanItems: FC<PlanItemsProps> = props => {
  const classes = useStyles()

  const [currentPlans, setCurrentPlans] = useState([] as StoragePlan[])
  const [plansCounter, setPlansCounter] = useState(0)
  const [availableMonths, setAvailableMonths] = useState([1, 2, 3])
  // const [availableMonths, setAvailableMonths] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  const [newContractLength, setNewContractLength] = useState(availableMonths[0])

  useEffect(() => {
    if (availableMonths.length > 0) {
      setNewContractLength(availableMonths[0])
    }
  }, [availableMonths])

  const onNewContractLengthChange = (value: number) => {
    setNewContractLength(value)
  }

  const onPlanAdded = (plan: StoragePlan) => {
    const newPlan = {
      ...plan,
      _internalId: plansCounter
    }
    setPlansCounter(plansCounter + 1)
    // add to the currentPlans
    setCurrentPlans([newPlan, ...currentPlans])
    // remove month from the available options
    setAvailableMonths([...availableMonths.filter(x => x !== plan.monthsDuration)])
  }

  const onItemRemoved = (plan: StoragePlan) => {
    // add the month to the available options
    setAvailableMonths([...availableMonths, plan.monthsDuration])
    // remove from the currentPlans
    setCurrentPlans([...currentPlans.filter(x => x._internalId !== plan._internalId)])
  }

  const editableProps: EditablePlanProps = {
    availableMonths,
    onPlanAdded,
    contractLength: newContractLength,
    onContractLengthChange: onNewContractLengthChange
  }

  return (
    <>
      {/* SET PLAN PRICES */}
      {
        availableMonths.length > 0 &&
        (
          <Grid item xs={12}>
            <Typography color='secondary' variant='subtitle1'>SET PLAN PRICES</Typography>
            <EditablePlan availableMonths={availableMonths} onPlanAdded={onPlanAdded}
              contractLength={newContractLength} onContractLengthChange={onNewContractLengthChange} />
          </Grid>
        )
      }
      {/* STORAGE PLANS */}
      {
        currentPlans.length > 0 &&
        (
          <Grid item xs={12}>
            <Typography gutterBottom color='secondary' variant='subtitle1'>STORAGE PLANS</Typography>
            <Grid className={classes.storagePlans} container spacing={2}>
              {/* {
                <PlanItemEditable />
              } */}
              {
                (currentPlans.sort((a, b) => a.monthsDuration - b.monthsDuration).map((p: StoragePlan) => {

                  const planItemProps = {
                    monthlyDuration: mayBePluralize(p.monthsDuration, 'month'),
                    rifPrice: p.pricePerGb,
                    onItemRemoved: () => onItemRemoved(p)
                  }
                  return (
                    <PlanItemEditable editableProps={{ ...editableProps, availableMonths: [...editableProps.availableMonths, p.monthsDuration] }}
                      planItemProps={planItemProps} />
                  )
                }
                ))
              }
            </Grid>
          </Grid>
        )
      }
    </>
  )
}

export default PlanItems



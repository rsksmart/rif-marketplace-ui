import React, {
  FC, useState, useEffect, useContext,
} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { colors } from '@rsksmart/rif-ui'
import { makeStyles } from '@material-ui/core/styles'
import EditablePlanItem, { EditablePlanItemProps } from 'components/molecules/storage/listing/EditablePlanItem'
import { StoragePlanItem } from 'store/Market/storage/interfaces'
import { mayBePluralize } from 'utils/utils'
import PlanItemEditable from 'components/organisms/storage/listing/PlanItemEditable'
import StorageListingStore from 'store/Market/storage/ListingStore'

const useStyles = makeStyles(() => ({
  subscriptionCreator: {
    alignItems: 'center',
  },
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px',
  },
  storagePlans: {
    alignItems: 'center',
  },
}))

// .ito - seguir por aca, agarrar los planItems y darle al add, edit y remove

const PlanItems: FC<{}> = () => {
  const { state: { plan }, dispatch } = useContext(StorageListingStore)
  const planItems = plan?.planItems || []
  const availableMonths = plan?.availableMonths || []

  const classes = useStyles()

  // const [availableMonths, setAvailableMonths] = useState([1, 2, 3])
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

  const onPlanAdded = (planItem: StoragePlanItem) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: planItem as any,
      // TODO: type properly
    })
  }

  const onItemRemoved = (planItem: StoragePlanItem) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: planItem as any,
      // TODO: type properly
    })
  }

  const editableProps: EditablePlanItemProps = {
    availableMonths,
    onPlanAdded,
    contractLength: newContractLength,
    onContractLengthChange: onNewContractLengthChange,
  }

  return (
    <>
      {/* SET PLAN PRICES */}
      {
        availableMonths.length > 0
        && (
          <Grid item xs={12}>
            <Typography color="secondary" variant="subtitle1">SET PLAN PRICES</Typography>
            <EditablePlanItem
              availableMonths={availableMonths}
              onPlanAdded={onPlanAdded}
              contractLength={newContractLength}
              onContractLengthChange={onNewContractLengthChange}
            />
          </Grid>
        )
      }
      {/* STORAGE PLANS */}
      {
        planItems.length > 0
        && (
          <Grid item xs={12}>
            <Typography gutterBottom color="secondary" variant="subtitle1">STORAGE PLANS</Typography>
            <Grid className={classes.storagePlans} container spacing={2}>
              {
                (planItems.sort((a, b) => a.monthsDuration - b.monthsDuration).map((p: StoragePlanItem) => {
                  const planItemProps = {
                    monthlyDuration: mayBePluralize(p.monthsDuration, 'month'),
                    rifPrice: p.pricePerGb,
                    onItemRemoved: () => onItemRemoved(p),
                  }
                  return (
                    <PlanItemEditable
                      key={p.internalId}
                      editableProps={{ ...editableProps, availableMonths: [...editableProps.availableMonths, p.monthsDuration] }}
                      planItemProps={planItemProps}
                    />
                  )
                }))
              }
            </Grid>
          </Grid>
        )
      }
    </>
  )
}

export default PlanItems

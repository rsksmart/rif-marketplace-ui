import React, {
  FC, useState, useContext, useEffect,
} from 'react'
import AddIcon from '@material-ui/icons/Add'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { StoragePlanItem } from 'store/Market/storage/interfaces'
import SaveIcon from '@material-ui/icons/Save'
import StorageListingStore from 'store/Market/storage/ListingStore'
import PlanItemBaseForm from './PlanItemBaseForm'

export interface EditablePlanItemProps {
  onPlanAdded?: (planItem: StoragePlanItem) => void
  onPlanSaved?: () => void
  // if there is a planItem, it's on edit mode. Otherwise we are adding a new plan
  planItem?: StoragePlanItem
}

const useStyles = makeStyles(() => ({
  subscriptionCreator: {
    alignItems: 'center',
  },
}))

const EditablePlanItem: FC<EditablePlanItemProps> = ({
  onPlanAdded,
  planItem,
  onPlanSaved,
}) => {
  const { state: { availableMonths, currency }, dispatch } = useContext(StorageListingStore)

  const classes = useStyles()
  const [pricePerGb, setPricePerGb] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState(planItem?.monthsDuration || availableMonths[0])

  useEffect(() => {
    if (availableMonths.length > 0) setSelectedMonth(planItem?.monthsDuration || availableMonths[0])
  }, [availableMonths, planItem])

  const handleOnAddClick = () => {
    const newPlanItem: StoragePlanItem = {
      pricePerGb,
      monthsDuration: selectedMonth,
      currency,
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: newPlanItem as any,
      // TODO: type properly
    })

    if (onPlanAdded) onPlanAdded(newPlanItem)
  }

  const handleOnSaveClick = () => {
    // dispatch EDIT
    const internalId = planItem?.internalId
    const planItemEdited: StoragePlanItem = {
      internalId,
      pricePerGb,
      monthsDuration: selectedMonth,
      currency,
    }
    // TODO: handle properly
    dispatch(({
      type: 'EDIT_ITEM',
      payload: planItemEdited as any,
    }))

    if (onPlanSaved) onPlanSaved()
  }

  const onPricePerGbChange = (value: number) => {
    setPricePerGb(value)
  }

  const onSelectedMonthChange = (value: number) => {
    setSelectedMonth(value)
  }

  return (
    <Grid className={classes.subscriptionCreator} container spacing={2}>
      {
        !planItem
        && (
        <>
          <Grid item xs={12}>
            <Typography gutterBottom color="secondary" variant="caption">Select the subscription period and the price and add a new storage plan to your list</Typography>
          </Grid>
          <PlanItemBaseForm
            monthsOptions={availableMonths}
            contractLength={selectedMonth}
            onPeriodChange={onSelectedMonthChange}
            onPriceChange={onPricePerGbChange}
            price={pricePerGb}
          />
        </>
        )
      }
      {
        // when editing we add the current month as available
        planItem
        && (
        <PlanItemBaseForm
          monthsOptions={[...availableMonths, planItem.monthsDuration]}
          contractLength={selectedMonth}
          onPeriodChange={onSelectedMonthChange}
          onPriceChange={onPricePerGbChange}
          price={pricePerGb}
        />
        )
      }

      <Grid item xs={2} md={2}>
        <Grid container direction="row">
          {/* START - PENDING EXTRACTION */}
          {/* EXTRACT TO NEW ATOM COMPONENT */}
          {
            planItem
            && (
            <Tooltip title="Save plan">
              <span>
                <IconButton
                  onClick={handleOnSaveClick}
                  disabled={pricePerGb <= 0}
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
              </span>
            </Tooltip>
            )
          }
          {/* EXTRACT TO NEW ATOM COMPONENT */}
          {
            !planItem
            && (
              <Tooltip title="Add plan">
                <span>
                  <IconButton
                    onClick={handleOnAddClick}
                    disabled={pricePerGb <= 0}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )
          }
          {/* END - PENDING EXTRACTION */}
          <Tooltip title="The average price for a monthly suscription is 2020 RIF">
            <IconButton>
              <InfoIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default EditablePlanItem

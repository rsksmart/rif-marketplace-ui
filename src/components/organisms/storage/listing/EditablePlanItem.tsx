import React, {
  FC, useState, useContext,
} from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { StoragePlanItem } from 'store/Market/storage/interfaces'
import StorageListingStore from 'store/Market/storage/ListingStore'
import { EditItemPayload, AddItemPayload } from 'store/Market/storage/listingActions'
import PlanItemBaseFormTemplate from 'components/templates/storage/listing/PlanItemBaseFormTemplate'
import TooltipIconButton, { TooltipIconButtonProps } from 'components/molecules/TooltipIconButton'
import AddIcon from '@material-ui/icons/Add'
import SaveIcon from '@material-ui/icons/Save'

export interface EditablePlanItemProps {
  onPlanAdded?: (planItem: StoragePlanItem) => void
  onPlanSaved?: () => void
  // if there is a planItem, it's on edit mode. Otherwise we are just creating a new plan
  planItem?: StoragePlanItem
}

const EditablePlanItem: FC<EditablePlanItemProps> = ({
  onPlanAdded,
  planItem,
  onPlanSaved,
}) => {
  const { state: { allMonthsOptions, availableMonths, currency }, dispatch } = useContext(StorageListingStore)

  const [pricePerGb, setPricePerGb] = useState(planItem?.pricePerGb || 1)
  const [selectedMonth, setSelectedMonth] = useState(planItem?.monthsDuration || availableMonths[0])

  const handleOnAddClick = () => {
    const newPlanItem: StoragePlanItem = {
      pricePerGb,
      monthsDuration: selectedMonth,
      currency,
    }
    dispatch({
      type: 'ADD_ITEM',
      payload: newPlanItem as AddItemPayload,
    })

    if (onPlanAdded) onPlanAdded(newPlanItem)
  }

  const handleOnSaveClick = () => {
    const internalId = planItem?.internalId
    dispatch(({
      type: 'EDIT_ITEM',
      payload: {
        internalId,
        pricePerGb,
        monthsDuration: selectedMonth,
        currency,
      } as EditItemPayload,
    }))

    if (onPlanSaved) onPlanSaved()
  }

  const onPricePerGbChange = (value: number) => {
    setPricePerGb(value)
  }

  const onSelectedMonthChange = (value: number) => {
    setSelectedMonth(value)
  }

  const actionButtonProps: TooltipIconButtonProps = planItem
    ? {
      tooltipTitle: 'Save plan',
      icon: <SaveIcon />,
      disabled: pricePerGb <= 0 || [...availableMonths, planItem.monthsDuration].indexOf(selectedMonth) === -1,
      onClick: handleOnSaveClick,
    }
    : {
      tooltipTitle: 'Add plan',
      icon: <AddIcon />,
      disabled: pricePerGb <= 0 || availableMonths.indexOf(selectedMonth) === -1,
      onClick: handleOnAddClick,
    }

  return (
    <Grid alignItems="center" container spacing={2}>
      {
        !planItem
        && (
        <Grid item xs={12}>
          <Typography gutterBottom color="secondary" variant="caption">Select the subscription period and the price and add a new storage plan to your list</Typography>
        </Grid>
        )
      }
      <PlanItemBaseFormTemplate
        monthsOptions={allMonthsOptions}
        contractLength={selectedMonth}
        onPeriodChange={onSelectedMonthChange}
        onPriceChange={onPricePerGbChange}
        price={pricePerGb}
      />

      <Grid item xs={2} md={2}>
        <Grid container direction="row">
          <TooltipIconButton {...actionButtonProps} />
          <TooltipIconButton
            tooltipTitle="The average price for a monthly suscription is 2020 RIF"
            icon={<InfoIcon color="secondary" />}
            disabled
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default EditablePlanItem

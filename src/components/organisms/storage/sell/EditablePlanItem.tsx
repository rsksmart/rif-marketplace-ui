import React, {
  FC, useState, useContext,
} from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { StoragePlanItem } from 'context/Services/storage/interfaces'
import StorageListingContext from 'context/Services/storage/ListingContext'
import { EditItemPayload, AddItemPayload } from 'context/Services/storage/listingActions'
import PlanItemBaseFormTemplate from 'components/templates/storage/sell/PlanItemBaseFormTemplate'
import { Button, TooltipIconButton } from '@rsksmart/rif-ui'
import SaveIcon from '@material-ui/icons/Save'
import { priceDisplay } from 'utils/utils'

export interface EditablePlanItemProps {
  onPlanAdded?: (planItem: StoragePlanItem) => void
  onPlanSaved?: () => void
  planItem?: StoragePlanItem
  fiatXR: number
  fiatDisplayName: string
}

const EditablePlanItem: FC<EditablePlanItemProps> = ({
  onPlanAdded,
  planItem,
  onPlanSaved,
  fiatXR, fiatDisplayName,
}) => {
  const { state: { allPeriods, availablePeriods }, dispatch } = useContext(StorageListingContext)

  const [pricePerGb, setPricePerGb] = useState(planItem?.pricePerGb || 1)
  const editMode = !!planItem

  const [timePeriod, setTimePeriod] = useState(planItem?.timePeriod || availablePeriods[0])
  // TODO: handle multicurrency options
  const [currency, setCurrency] = useState('RBTC')

  const fiatPrice = priceDisplay(pricePerGb * fiatXR, 2)

  const handleOnAddClick = () => {
    const newPlanItem: StoragePlanItem = {
      pricePerGb,
      currency,
      timePeriod,
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
        currency,
        timePeriod,
      } as EditItemPayload,
    }))

    if (onPlanSaved) onPlanSaved()
  }

  const onPricePerGbChange = (value: number) => {
    setPricePerGb(value)
  }

  const onSelectedPeriodChange = (value: number) => {
    setTimePeriod(value)
  }

  const ActionButton = () => (editMode
    ? (
      <TooltipIconButton
        tooltipTitle="Save plan"
        icon={<SaveIcon />}
        disabled={pricePerGb <= 0 || ![...availablePeriods, planItem?.timePeriod].includes(timePeriod)}
        onClick={handleOnSaveClick}
      />
    )
    : (
      <Button
        color="primary"
        variant="outlined"
        rounded
        onClick={handleOnAddClick}
        disabled={pricePerGb <= 0 || !availablePeriods.includes(timePeriod)}
      >
        {' '}
        Add storage plan
      </Button>
    ))

  return (
    <Grid alignItems="center" container spacing={3}>
      {
        !editMode
        && (
          <Grid item xs={12}>
            <Typography gutterBottom color="secondary" variant="caption">Select the subscription period and the price and add a new storage plan to your list</Typography>
          </Grid>
        )
      }
      <PlanItemBaseFormTemplate
        onPeriodChange={onSelectedPeriodChange}
        onPriceChange={onPricePerGbChange}
        price={pricePerGb}
        currency={currency}
        fiatPrice={fiatPrice}
        fiatDisplayName={fiatDisplayName}
        periodOptions={allPeriods}
        selectedPeriod={timePeriod}
        availablePeriods={availablePeriods}
      />
      <Grid item xs={2} md={3}>
        <Grid container direction="row">
          <TooltipIconButton
            tooltipTitle="The average price for a monthly suscription is 2020 RIF"
            icon={<InfoIcon color="secondary" />}
            iconButtonProps={{ disabled: true }}
          />
          <ActionButton />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default EditablePlanItem

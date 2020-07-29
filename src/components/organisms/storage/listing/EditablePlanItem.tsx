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
import MarketStore from 'store/Market/MarketStore'

export interface EditablePlanItemProps {
  onPlanAdded?: (planItem: StoragePlanItem) => void
  onPlanSaved?: () => void
  planItem?: StoragePlanItem
}

const EditablePlanItem: FC<EditablePlanItemProps> = ({
  onPlanAdded,
  planItem,
  onPlanSaved,
}) => {
  const { state: { allMonthsOptions, availableMonths, currency }, dispatch } = useContext(StorageListingStore)

  // TODO: send criptoDisplayName, fiatDisplayName and rate in the props
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketStore)

  const currencySimbol = currency.toLowerCase()
  const { rate } = crypto[currencySimbol]
  const { displayName: fiatDisplayName } = currentFiat

  const [pricePerGb, setPricePerGb] = useState(planItem?.pricePerGb || 1)
  const [selectedMonth, setSelectedMonth] = useState(planItem?.monthsDuration || availableMonths[0])
  const editMode = !!planItem

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

  const actionButtonProps: TooltipIconButtonProps = editMode
    ? {
      tooltipTitle: 'Save plan',
      icon: <SaveIcon />,
      iconButtonProps: {
        disabled: pricePerGb <= 0 || ![...availableMonths, planItem?.monthsDuration].includes(selectedMonth),
        onClick: handleOnSaveClick,
      },
    }
    : {
      tooltipTitle: 'Add plan',
      icon: <AddIcon />,
      iconButtonProps: {
        disabled: pricePerGb <= 0 || !availableMonths.includes(selectedMonth),
        onClick: handleOnAddClick,
      },
    }

  return (
    <Grid alignItems="center" container spacing={2}>
      {
        !editMode
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
        fiatPrice={`${pricePerGb * rate}`}
        fiatSymbol={fiatDisplayName}
      />

      <Grid item xs={2} md={2}>
        <Grid container direction="row">
          <TooltipIconButton {...actionButtonProps} />
          <TooltipIconButton
            tooltipTitle="The average price for a monthly suscription is 2020 RIF"
            icon={<InfoIcon color="secondary" />}
            iconButtonProps={{ disabled: true }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default EditablePlanItem

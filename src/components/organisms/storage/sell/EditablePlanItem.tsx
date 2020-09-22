import React, {
  FC, useState, useContext,
} from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { EditItemPayload, AddItemPayload } from 'context/Market/storage/offerEditActions'
import { StoragePlanItem, TimePeriodEnum } from 'context/Market/storage/interfaces'
import { Button, TooltipIconButton } from '@rsksmart/rif-ui'
import SaveIcon from '@material-ui/icons/Save'
import CryptoPriceConverter from 'components/molecules/CryptoPriceConverter'
import { TextField, MenuItem } from '@material-ui/core'
import { MarketCryptoRecord } from 'models/Market'

export interface EditablePlanItemProps {
  onPlanAdded?: (planItem: StoragePlanItem) => void
  onPlanSaved?: () => void
  planItem?: StoragePlanItem
  cryptoXRs: MarketCryptoRecord
  fiatDisplayName: string
}

const EditablePlanItem: FC<EditablePlanItemProps> = ({
  onPlanAdded,
  planItem,
  onPlanSaved,
  cryptoXRs,
  fiatDisplayName,
}) => {
  const { state: { allPeriods, usedPeriodsPerCurrency }, dispatch } = useContext(OfferEditContext)

  const editMode = !!planItem
  // TODO: remove hard-coded currency by default
  const [currency, setCurrency] = useState(planItem?.currency || 'RBTC')
  const [pricePerGb, setPricePerGb] = useState(planItem?.pricePerGb || 1)
  const [timePeriod, setTimePeriod] = useState(planItem?.timePeriod || allPeriods[0])

  const onPriceChange = ({ target: { value } }) => setPricePerGb(value)
  const onCurrencyChange = ({ target: { value } }) => setCurrency(value)
  const onSelectedPeriodChange = ({ target: { value } }) => setTimePeriod(value)

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

  const ActionButton = () => {
    if (!editMode) {
      return (
        <Button
          color="primary"
          variant="outlined"
          rounded
          onClick={handleOnAddClick}
          disabled={pricePerGb <= 0 || usedPeriodsPerCurrency[currency]?.includes(timePeriod)}
        >
          {' '}
          Add storage plan
        </Button>
      )
    }
    const hasChanged = planItem?.timePeriod !== timePeriod || planItem?.currency !== currency
    const currencyAndPeriodInUse = usedPeriodsPerCurrency[currency].includes(timePeriod)
    // the period or currency have changed and the selected option is in use
    const isDisabled = pricePerGb <= 0 || (hasChanged && currencyAndPeriodInUse)

    return (
      <TooltipIconButton
        tooltipTitle="Save plan"
        icon={<SaveIcon />}
        iconButtonProps={{
          disabled: isDisabled,
          onClick: handleOnSaveClick,
        }}
      />
    )
  }

  return (
    <>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            required
            label="Period"
            id="subscription-period-select"
            value={timePeriod}
            onChange={onSelectedPeriodChange}
            InputProps={{
              style: { textAlign: 'center' },
            }}
          >
            {
              allPeriods.sort((a, b) => a - b).map(
                (option: TimePeriodEnum) => {
                  const isDisabled = usedPeriodsPerCurrency[currency]?.includes(option) && option !== planItem?.timePeriod
                  return (
                    <MenuItem value={option} key={option} disabled={isDisabled}>
                      {TimePeriodEnum[option]}
                    </MenuItem>
                  )
                },
              )
            }
          </TextField>
        </Grid>
        <Grid item xs={12} md={7}>
          <CryptoPriceConverter
            fiatDisplayName={fiatDisplayName}
            cryptoXRs={cryptoXRs}
            priceLabel="Price/GB"
            price={pricePerGb}
            onPriceChange={onPriceChange}
            currency={currency}
            onCurrencyChange={onCurrencyChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TooltipIconButton
            tooltipTitle="The average price for a monthly suscription is 2020 RIF"
            icon={<InfoIcon color="secondary" />}
            iconButtonProps={{ disabled: true }}
          />
          <ActionButton />
        </Grid>
      </Grid>
    </>
  )
}

export default EditablePlanItem

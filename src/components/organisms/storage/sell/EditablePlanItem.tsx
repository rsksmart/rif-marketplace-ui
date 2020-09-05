import React, {
  FC, useState, useContext,
} from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import { StoragePlanItem, TimePeriodEnum } from 'context/Services/storage/interfaces'
import StorageListingContext from 'context/Services/storage/ListingContext'
import { EditItemPayload, AddItemPayload } from 'context/Services/storage/listingActions'
import { Button, TooltipIconButton } from '@rsksmart/rif-ui'
import SaveIcon from '@material-ui/icons/Save'
import { MarketCryptoRecord } from 'context/Market/MarketContext'
import CryptoPriceConverter from 'components/molecules/CryptoPriceConverter'
import { TextField, MenuItem } from '@material-ui/core'

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
  const { state: { allPeriods, availablePeriods }, dispatch } = useContext(StorageListingContext)

  const editMode = !!planItem
  // TODO: handle multicurrency options
  const [currency, setCurrency] = useState('RBTC')
  const [pricePerGb, setPricePerGb] = useState(planItem?.pricePerGb || 1)
  const [timePeriod, setTimePeriod] = useState(planItem?.timePeriod || availablePeriods[0])

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
                (option) => {
                  const isDisabled = !availablePeriods.includes(option)
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

import React, {
  FC, useState, useContext,
} from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { EditItemPayload, AddItemPayload } from 'context/Market/storage/offerEditActions'
import { StorageBillingPlan } from 'context/Market/storage/interfaces'
import { Button, TooltipIconButton } from '@rsksmart/rif-ui'
import SaveIcon from '@material-ui/icons/Save'
import CryptoPriceConverter from 'components/molecules/CryptoPriceConverter'
import { TextField, MenuItem } from '@material-ui/core'
import { MarketCryptoRecord } from 'models/Market'
import { SubscriptionPeriod } from 'models/marketItems/StorageItem'
import Big from 'big.js'

export interface EditableBillingPlanProps {
  onPlanAdded?: (billingPlan: StorageBillingPlan) => void
  onPlanSaved?: () => void
  billingPlan?: StorageBillingPlan
  cryptoXRs: MarketCryptoRecord
  fiatDisplayName: string
}

const EditableBillingPlan: FC<EditableBillingPlanProps> = ({
  onPlanAdded,
  billingPlan,
  onPlanSaved,
  cryptoXRs,
  fiatDisplayName,
}) => {
  const { state: { allBillingPeriods, usedPeriodsPerCurrency }, dispatch } = useContext(OfferEditContext)

  const editMode = !!billingPlan
  // TODO: remove hard-coded currency by default
  const [currency, setCurrency] = useState(billingPlan?.currency || 'rbtc')
  const [pricePerGb, setPricePerGb] = useState(billingPlan?.price.toString())
  const [period, setPeriod] = useState(billingPlan?.period || allBillingPeriods[0])

  const onPriceChange = ({ target: { value } }) => setPricePerGb(value)
  const onCurrencyChange = ({ target: { value } }) => setCurrency(value)
  const onSelectedPeriodChange = ({ target: { value } }) => setPeriod(value)

  const handleOnAddClick = () => {
    if (!pricePerGb) return
    const newBillingPlan: StorageBillingPlan = {
      price: new Big(pricePerGb),
      currency,
      period,
    }
    dispatch({
      type: 'ADD_ITEM',
      payload: newBillingPlan as AddItemPayload,
    })

    if (onPlanAdded) onPlanAdded(newBillingPlan)
  }

  const handleOnSaveClick = () => {
    if (!pricePerGb) return
    const internalId = billingPlan?.internalId
    dispatch(({
      type: 'EDIT_ITEM',
      payload: {
        internalId,
        price: new Big(pricePerGb),
        currency,
        period,
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
          disabled={Number(pricePerGb) <= 0 || usedPeriodsPerCurrency[currency]?.includes(period)}
        >
          {' '}
          Add storage plan
        </Button>
      )
    }
    const hasChanged = billingPlan?.period !== period || billingPlan?.currency !== currency
    const currencyAndPeriodInUse = usedPeriodsPerCurrency[currency].includes(period)
    // the period or currency have changed and the selected option is in use
    const isDisabled = Number(pricePerGb) <= 0 || (hasChanged && currencyAndPeriodInUse)

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
            value={period}
            onChange={onSelectedPeriodChange}
            InputProps={{
              style: { textAlign: 'center' },
            }}
          >
            {
              allBillingPeriods.sort((a, b) => a - b).map(
                (option: SubscriptionPeriod) => {
                  const isDisabled = usedPeriodsPerCurrency[currency]?.includes(option) && option !== billingPlan?.period
                  return (
                    <MenuItem value={option} key={option} disabled={isDisabled}>
                      {option}
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

export default EditableBillingPlan

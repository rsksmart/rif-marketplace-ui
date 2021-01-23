import { MenuItem, TextField } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import InfoIcon from '@material-ui/icons/Info'
import SaveIcon from '@material-ui/icons/Save'
import { Button, TooltipIconButton } from '@rsksmart/rif-ui'
import Big from 'big.js'
import CryptoPriceConverter from 'components/molecules/CryptoPriceConverter'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { MarketCryptoRecord } from 'models/Market'
import { PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import React, { FC, useContext, useState } from 'react'
import { StorageBillingPlan, OfferEditContextProps } from 'context/Market/storage/interfaces'
import { SYSTEM_TOKENS, Token, SupportedTokens } from 'models/Token'
import { getNFTokenByName } from 'utils/tokenUtils'

export interface EditableBillingPlanProps {
  onPlanAdded?: (billingPlan: StorageBillingPlan) => void
  onPlanSaved?: (billingPlan: StorageBillingPlan) => void
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
  const {
    state: { allBillingPeriods, usedPeriodsPerCurrency },
  } = useContext<OfferEditContextProps>(OfferEditContext)

  const editMode = Boolean(billingPlan)
  const [currency, setCurrency] = useState<Token>(
    billingPlan?.currency || SYSTEM_TOKENS.rbtc,
  )
  const [pricePerGb, setPricePerGb] = useState(billingPlan?.price.toString())
  const [period, setPeriod] = useState(
    billingPlan?.period || allBillingPeriods[0],
  )

  const onPriceChange = (
    { target: { value } },
  ): void => setPricePerGb(value)
  const onCurrencyChange = (
    { target: { value: symbol } },
  ): void => setCurrency(getNFTokenByName(symbol as SupportedTokens))
  const onSelectedPeriodChange = (
    { target: { value } },
  ): void => setPeriod(value)

  const handleOnAddClick = (): void => {
    if (!pricePerGb) return
    const newBillingPlan: StorageBillingPlan = {
      price: new Big(pricePerGb),
      currency,
      period,
    }

    if (onPlanAdded) onPlanAdded(newBillingPlan)
  }

  const handleOnSaveClick = (): void => {
    if (!pricePerGb) return
    const internalId = billingPlan?.internalId
    const savedBillingPlan: StorageBillingPlan = {
      internalId,
      price: new Big(pricePerGb),
      currency,
      period,
    }

    if (onPlanSaved) onPlanSaved(savedBillingPlan)
  }

  const ActionButton = (): JSX.Element => {
    if (!editMode) {
      const addIsDisabled = Number(pricePerGb) <= 0
        || usedPeriodsPerCurrency[currency.token]?.includes(period)

      return (
        <Button
          color="primary"
          variant="outlined"
          rounded
          onClick={handleOnAddClick}
          disabled={addIsDisabled}
        >
          {' '}
          Add storage plan
        </Button>
      )
    }
    const hasChanged = billingPlan?.period !== period
      || billingPlan?.currency !== currency
    const currencyAndPeriodInUse = usedPeriodsPerCurrency[currency.token]?.includes(
      period
    )
    // the period or currency have changed and the selected option is in use
    const isDisabled = Number(pricePerGb) <= 0
      || (hasChanged && currencyAndPeriodInUse)

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
              allBillingPeriods
                .sort((a, b) => PeriodInSeconds[a] - PeriodInSeconds[b])
                .map(
                  (option: SubscriptionPeriod) => {
                    const isDisabled = usedPeriodsPerCurrency[currency.token]?.includes(option)
                      && option !== billingPlan?.period
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

import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import { colors, validatedNumber } from '@rsksmart/rif-ui'
import { TimePeriodEnum } from 'context/Services/storage/interfaces'
import LabelWithValue from 'components/atoms/LabelWithValue'

export interface PlanItemBaseFormTemplateProps {
  periodOptions: TimePeriodEnum[]
  availablePeriods: TimePeriodEnum[]
  selectedPeriod: TimePeriodEnum
  onPeriodChange: (value: number) => void
  price: number
  currency: string
  onPriceChange: (value: number) => void
  fiatPrice: string
  fiatDisplayName: string
}

const PlanItemBaseFormTemplate: FC<PlanItemBaseFormTemplateProps> = (props) => {
  const {
    onPeriodChange, price, onPriceChange, fiatPrice, fiatDisplayName,
    currency, periodOptions, selectedPeriod, availablePeriods,
  } = props

  const handleOnPeriodChange = ({ target: { value } }) => {
    onPeriodChange(value)
  }

  const handleOnPriceChange = ({ target: { value } }) => {
    onPriceChange(validatedNumber(value))
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <TextField
          select
          fullWidth
          required
          label="Period"
          id="subscription-period-select"
          value={selectedPeriod}
          onChange={handleOnPeriodChange}
          InputProps={{
            style: { textAlign: 'center' },
          }}
        >
          {
            periodOptions.sort((a, b) => a - b).map(
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
      <Grid item xs={12} md={3}>
        <TextField
          select
          fullWidth
          label="Currency"
          id="currency-select"
          value={currency}
          InputProps={{
            style: { textAlign: 'center' },
          }}
        // TODO: handle on change
        >
          <MenuItem value="RBTC">RBTC</MenuItem>
          <MenuItem value="RIF">RIF</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid
          container
          spacing={1}
          alignItems="center"
        >
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              label="Price/GB"
              id="price-gb"
              type="number"
              value={price.toString()}
              onChange={handleOnPriceChange}
              error={price <= 0}
              InputProps={{
                inputProps: {
                  min: '0',
                  style: { textAlign: 'center' },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="secondary">{currency}</Typography>
                  </InputAdornment>
                ),
                style: { color: colors.primary },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelWithValue label={fiatPrice} value={fiatDisplayName} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PlanItemBaseFormTemplate

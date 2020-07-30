import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import { colors, validatedNumber } from '@rsksmart/rif-ui'
import { makeStyles } from '@material-ui/core'
import { TimePeriodEnum } from 'store/Market/storage/interfaces'

export interface PlanItemBaseFormTemplateProps {
  onPeriodChange: (value: number) => void
  price: number
  onPriceChange: (value: number) => void
  fiatPrice: string
  fiatSymbol: string
  periodOptions: TimePeriodEnum[]
  availablePeriods: TimePeriodEnum[]
  selectedPeriod: TimePeriodEnum
}

const useStyles = makeStyles(() => ({
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px',
  },
}))

const PlanItemBaseFormTemplate: FC<PlanItemBaseFormTemplateProps> = (props) => {
  const {
    onPeriodChange, price, onPriceChange, fiatPrice, fiatSymbol,
    periodOptions, selectedPeriod, availablePeriods,
  } = props

  const classes = useStyles()

  const handleOnPeriodChange = ({ target: { value } }) => {
    onPeriodChange(value)
  }

  const handleOnPriceChange = ({ target: { value } }) => {
    onPriceChange(Number(validatedNumber(value)))
  }

  return (
    <>
      {/* available months */}
      <Grid item xs={12} md={5}>
        <TextField
          select
          fullWidth
          required
          label="Subscription Period"
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
      {/* price */}
      <Grid item xs={10} md={5}>
        <Grid className={classes.subscriptionCreatorPrice} container spacing={1}>
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
                    <Typography variant="caption" color="primary">RIF</Typography>
                  </InputAdornment>
                ),
                style: { color: colors.primary },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              label=" "
              id="price-gb-usd"
              value={fiatPrice}
              InputProps={{
                inputProps: {
                  style: { textAlign: 'center' },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="secondary">{fiatSymbol}</Typography>
                  </InputAdornment>
                ),
                style: { color: colors.gray4 },
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default PlanItemBaseFormTemplate

import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import { colors, validatedNumber } from '@rsksmart/rif-ui'
import { makeStyles } from '@material-ui/core'
import { mayBePluralize } from '../../../../utils/utils'

export interface PlanItemBaseFormProps {
  monthsOptions: number[]
  contractLength: number
  onPeriodChange: (value: number) => void
  price: number
  onPriceChange: (value: number) => void
}

const useStyles = makeStyles(() => ({
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px',
  },
}))

const PlanItemBaseForm: FC<PlanItemBaseFormProps> = ({
  monthsOptions, contractLength, onPeriodChange, price, onPriceChange,
}) => {
  const classes = useStyles()

  const handleOnPeriodChange = ({ target: { value } }) => {
    onPeriodChange(Number(validatedNumber(value)))
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
          value={contractLength}
          onChange={handleOnPeriodChange}
        >
          {
            monthsOptions.sort((a, b) => a - b).map((mo) => (
              <MenuItem value={mo} key={mo}>{mayBePluralize(mo, 'month')}</MenuItem>
            ))
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
              value="100"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="secondary">USD</Typography>
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

export default PlanItemBaseForm

import { createStyles, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { SupportedTokens, tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'

export type AmountWithCurrencySelectProps = {
  amountLabel?: string
  amount?: number
  className?: string
  onAmountChange: (event: React.ChangeEvent<{ name?: string, value: unknown }>) => void
  onCurrencyChange: (event: React.ChangeEvent<{ name?: string, value: unknown }>) => void
  selectedCurrency: SupportedTokens
  currencyOptions: SupportedTokens[]
}

const useStyles = makeStyles(() => createStyles({
  currencySelectContainer: {
    display: 'flex',
  },
}))

const AmountWithCurrencySelect: FC<AmountWithCurrencySelectProps> = (props) => {
  const {
    amountLabel,
    amount,
    className,
    onAmountChange,
    selectedCurrency,
    onCurrencyChange,
    currencyOptions,
  } = props

  const classes = useStyles()
  return (
    <Grid
      className={className}
      container
      justify="center"
    >
      <Grid item>
        <TextField
          required
          fullWidth
          type="number"
          label={amountLabel}
          value={amount || ''}
          error={!amount || amount <= 0}
          inputProps={{
            min: '0',
            style: { textAlign: 'center' },
          }}
          onChange={onAmountChange}
        />
      </Grid>
      <Grid
        item
        className={classes.currencySelectContainer}
      >
        <Select
          value={selectedCurrency}
          onChange={onCurrencyChange}
          variant="standard"
          color="secondary"
        >
          {currencyOptions.map(
            (option: SupportedTokens) => (
              <MenuItem key={option as string} value={option}>
                {tokenDisplayNames[option]}
              </MenuItem>
            ),
          )}
        </Select>
      </Grid>
    </Grid>
  )
}

export default AmountWithCurrencySelect
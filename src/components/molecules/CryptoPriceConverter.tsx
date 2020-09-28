import React, { FC } from 'react'
import {
  Grid, TextField, MenuItem, InputAdornment, Typography,
} from '@material-ui/core'
import LabelWithValue from 'components/atoms/LabelWithValue'
import { colors } from '@rsksmart/rif-ui'
import { MarketCryptoRecord } from 'models/Market'
import Big from 'big.js'

export interface CryptoPriceConverterProps {
  cryptoXRs: MarketCryptoRecord
  priceLabel?: string
  fiatDisplayName: string
  price: Big
  onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  currency: string
  onCurrencyChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CryptoPriceConverter: FC<CryptoPriceConverterProps> = (props) => {
  const {
    cryptoXRs, priceLabel = 'Price', price, onPriceChange, fiatDisplayName, currency, onCurrencyChange,
  } = props
  const { rate } = cryptoXRs[currency.toLowerCase()]

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <TextField
          select
          fullWidth
          label="Currency"
          id="currency-select"
          value={currency}
          InputProps={{
            style: { textAlign: 'center' },
          }}
          onChange={onCurrencyChange}
        >
          {
            Object.keys(cryptoXRs).map((xrName) => {
              const { displayName: cryptoDisplayName } = cryptoXRs[xrName]
              return (
                <MenuItem
                  key={xrName}
                  value={xrName}
                >
                  {cryptoDisplayName}
                </MenuItem>
              )
            })
          }
        </TextField>
      </Grid>
      <Grid item xs={6} md={4}>
        <TextField
          fullWidth
          required
          label={priceLabel}
          id="price-gb"
          type="number"
          value={price.toString()}
          onChange={onPriceChange}
          error={Number(price) <= 0}
          InputProps={{
            inputProps: {
              min: '0',
              style: { textAlign: 'center' },
            },
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="secondary">{currency.toUpperCase()}</Typography>
              </InputAdornment>
            ),
            style: { color: colors.primary },
          }}
        />
      </Grid>
      <Grid item xs={6} md={4}>
        <LabelWithValue label={(price.mul(rate)).toString()} value={fiatDisplayName} />
      </Grid>
    </Grid>
  )
}

export default CryptoPriceConverter

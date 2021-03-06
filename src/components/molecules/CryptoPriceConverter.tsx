import React, { FC } from 'react'
import {
  Grid, TextField, MenuItem, InputAdornment, Typography,
} from '@material-ui/core'
import LabelWithValue from 'components/atoms/LabelWithValue'
import { colors } from '@rsksmart/rif-ui'
import { MarketCryptoRecord } from 'models/Market'
import Big from 'big.js'
import { BaseToken } from 'models/Token'

export interface CryptoPriceConverterProps {
  cryptoXRs: MarketCryptoRecord
  priceLabel?: string
  fiatDisplayName: string
  price?: string
  onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  currency: BaseToken
  onCurrencyChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CryptoPriceConverter: FC<CryptoPriceConverterProps> = (props) => {
  const {
    cryptoXRs, priceLabel = 'Price', price, onPriceChange, fiatDisplayName, currency, onCurrencyChange,
  } = props
  const { rate } = cryptoXRs[currency.symbol]

  const fiatPrice = price ? (new Big(price)).mul(rate).toString() : ''
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <TextField
          select
          fullWidth
          label="Currency"
          id="currency-select"
          value={currency.symbol}
          InputProps={{
            style: { textAlign: 'center' },
          }}
          onChange={onCurrencyChange}
        >
          {
            Object.keys(cryptoXRs).map((symbol) => {
              const { displayName: cryptoDisplayName } = cryptoXRs[symbol]
              return (
                <MenuItem
                  key={symbol}
                  value={symbol}
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
          value={price}
          onChange={onPriceChange}
          error={!price || Number(price) <= 0}
          InputProps={{
            inputProps: {
              min: '0',
              style: { textAlign: 'center' },
            },
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="secondary">{currency.displayName}</Typography>
              </InputAdornment>
            ),
            style: { color: colors.primary },
          }}
        />
      </Grid>
      <Grid item xs={6} md={4}>
        <LabelWithValue label={fiatPrice} value={fiatDisplayName} />
      </Grid>
    </Grid>
  )
}

export default CryptoPriceConverter

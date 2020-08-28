import React, { useContext } from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import { colors, validatedNumber } from '@rsksmart/rif-ui'
import StorageListingContext from 'context/Services/storage/ListingContext'
import { StorageListingContextProps } from 'context/Services/storage/interfaces'
import { SetAvailableSizePayload, SetCurrencyPayload } from 'context/Services/storage/listingActions'

const BaseSettings = () => {
  const { state: { availableSize, system, currency }, dispatch } = useContext<StorageListingContextProps>(StorageListingContext)

  const onSizeChange = ({ target: { value } }) => {
    dispatch({
      type: 'SET_AVAILABLE_SIZE',
      payload: {
        availableSize: validatedNumber(value),
      } as SetAvailableSizePayload,
    })
  }

  const onCurrencyChange = ({ target: { value } }) => {
    dispatch({
      type: 'SET_CURRENCY',
      payload: {
        currency: value,
      } as SetCurrencyPayload,
    })
  }

  return (
    <>
      <Grid item xs={12} md={4}>
        <TextField
          select
          fullWidth
          required
          label="System"
          id="system-select"
          value={system}
          disabled
        >
          <MenuItem value="IPFS">IPFS</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid alignItems="center" container spacing={1}>
          <Grid item xs={10}>
            <TextField
              required
              fullWidth
              type="number"
              label="Available Size"
              id="available-size"
              value={availableSize.toString()}
              onChange={onSizeChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="primary">GB</Typography>
                  </InputAdornment>
                ),
                inputProps: {
                  min: '0',
                  style: {
                    color: colors.primary,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Tooltip title="Different buyers can hire portions of the total size.">
              <InfoIcon color="secondary" />
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          select
          fullWidth
          label="Currency"
          id="currency-select"
          value={currency}
          onChange={onCurrencyChange}
          disabled
        >
          <MenuItem value="RBTC">RBTC</MenuItem>
          <MenuItem disabled value="RIF">RIF</MenuItem>
        </TextField>
      </Grid>
    </>
  )
}

export default BaseSettings

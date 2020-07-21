import React, { FC, useContext } from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import { colors, validatedNumber } from '@rsksmart/rif-ui'
import CountrySelect from 'components/molecules/storage/CountrySelect'
import StorageListingStore from 'store/Market/storage/ListingStore'
import { CountryType } from 'models/Country'
import { StorageListingStoreProps } from 'store/Market/storage/interfaces'

const BaseSettings: FC<{}> = () => {
  const { state: { availableSize, system, currency }, dispatch } = useContext<StorageListingStoreProps>(StorageListingStore)

  const onSizeChange = ({ target: { value } }) => {
    dispatch({
      type: 'SET_AVAILABLE_SIZE',
      payload: {
        availableSize: validatedNumber(Number(value)),
      } as any,
      // TODO: type properly
    })
  }

  const onCountryChange = (country: CountryType | null) => {
    dispatch({
      type: 'SET_COUNTRY',
      payload: {
        country: country?.name,
      } as any,
      // TODO: type properly
    })
  }

  return (
    <>
      <Grid item xs={12} md={6}>
        <TextField
          select
          fullWidth
          required
          label="System"
          id="system-select"
          value={system}
        >
          <MenuItem value="IPFS">IPFS</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
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
      <Grid item xs={12} md={6}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={10}>
            <CountrySelect onChange={onCountryChange} />
          </Grid>
          <Grid item xs={2}>
            <Tooltip title="Regulations to use the uploaded content are directly associated to the location.">
              <InfoIcon color="secondary" />
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          fullWidth
          label="Currency"
          id="currency-select"
          value={currency}
        >
          <MenuItem value="RIF">RIF</MenuItem>
        </TextField>
      </Grid>
    </>
  )
}

export default BaseSettings

import React, { FC, useState } from 'react'

import InfoIcon from '@material-ui/icons/Info';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

import { colors, validatedNumber } from '@rsksmart/rif-ui'
import CountrySelect from 'components/molecules/storage/CountrySelect';

export interface BaseSettingsProps { }

// .ito - level up the props
const BaseSettings: FC<BaseSettingsProps> = () => {
  const system = 'IPFS'
  const currency = 'RIF'
  const [availableSize, setAvailableSize] = useState(1)

  const onSizeChange = ({ target: { value } }) => {
    setAvailableSize(validatedNumber(Number(value)))
  }

  return (
    <>
      <Grid item xs={12} md={6}>
        <TextField
          select fullWidth required label='System'
          id="system-select"
          value={system}
        >
          <MenuItem value='IPFS'>IPFS</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid alignItems='center' container spacing={1}>
          <Grid item xs={10}>
            <TextField
              required
              fullWidth
              type='number'
              label="Available Size"
              id="available-size"
              value={availableSize.toString()}
              onChange={onSizeChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant='caption' color='primary'>GB</Typography>
                  </InputAdornment>
                ),
                style: { color: colors.primary }
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Tooltip title='Different buyers can hire portions of the total size.' >
              <InfoIcon color='secondary' />
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={1} alignItems='center'>
          <Grid item xs={10}>
            <CountrySelect />
          </Grid>
          <Grid item xs={2}>
            <Tooltip title='Regulations to use the uploaded content are directly associated to the location.'>
              <InfoIcon color='secondary' />
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select fullWidth label='Currency'
          id="currency-select"
          value={currency}
        >
          <MenuItem value='RIF'>RIF</MenuItem>
        </TextField>
      </Grid>
    </>
  )
}

export default BaseSettings

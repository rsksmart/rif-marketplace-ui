import React, { FC } from 'react'
import { Grid, MenuItem, TextField, InputAdornment, Typography, Tooltip } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info';
import { colors } from '@rsksmart/rif-ui'

export interface BaseSettingsProps { }

const BaseSettings: FC<BaseSettingsProps> = ({ }) => {
  return (
    <>
      <Grid item xs={12} md={6}>
        <TextField
          select fullWidth required label='System'
          id="system-select"
          value='IPFS'
        >
          <MenuItem value='IPFS'>IPFS</MenuItem>
          <MenuItem value='ASDF'>ASDF</MenuItem>
          <MenuItem value='ZXCVB'>ZXCVB</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid alignItems='center' container spacing={1}>
          <Grid item xs={10}>
            <TextField
              required
              fullWidth
              label="Available Size"
              id="available-size"
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
            <TextField
              select fullWidth label='Location'
              id="location-select"
              value='ARG'
            >
              <MenuItem value='ARG'>ARG</MenuItem>
              <MenuItem value='SVK'>SVK</MenuItem>
              <MenuItem value='UYU'>UYU</MenuItem>
              <MenuItem value='CZE'>CZE</MenuItem>
              <MenuItem value='UKR'>UKR</MenuItem>
            </TextField>
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
          value='RIF'
        >
          <MenuItem value='RIF'>RIF</MenuItem>
          <MenuItem value='USD'>USD</MenuItem>
        </TextField>
      </Grid>
    </>
  )
}

export default BaseSettings

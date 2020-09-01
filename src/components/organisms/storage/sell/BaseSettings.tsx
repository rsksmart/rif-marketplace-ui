import React, { useContext, useState } from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import { Button, colors, validatedNumber } from '@rsksmart/rif-ui'
import StorageListingContext from 'context/Services/storage/ListingContext'
import { StorageListingContextProps } from 'context/Services/storage/interfaces'
import { SetAvailableSizePayload } from 'context/Services/storage/listingActions'

const BaseSettings = () => {
  const { state: { availableSize, system }, dispatch } = useContext<StorageListingContextProps>(StorageListingContext)
  // TODO: move to context
  const [peerId, setPeerId] = useState('')

  const onSizeChange = ({ target: { value } }) => {
    dispatch({
      type: 'SET_AVAILABLE_SIZE',
      payload: {
        availableSize: validatedNumber(value),
      } as SetAvailableSizePayload,
    })
  }

  const onPeerIdChange = ({ target: { value } }) => {
    setPeerId(value)
  }

  return (
    <Grid container spacing={2}>
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
      <Grid item xs={12} md={2}>
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
                    textAlign: 'center',
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
      <Grid item xs={8} md={4}>
        <TextField
          required
          fullWidth
          label="Peer ID"
          id="peer-id"
          value={peerId}
          onChange={onPeerIdChange}
          placeholder="Paste here your Peer ID"
        />
      </Grid>
      <Grid item xs={4} md={2}>
        <Button color="primary" rounded>Get Peer ID</Button>
      </Grid>
    </Grid>
  )
}

export default BaseSettings

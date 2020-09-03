import React, { useContext, useState } from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import {
  Button, colors, ModalDialogue, validatedNumber,
} from '@rsksmart/rif-ui'
import StorageListingContext from 'context/Services/storage/ListingContext'
import { StorageListingContextProps } from 'context/Services/storage/interfaces'
import { SetAvailableSizePayload } from 'context/Services/storage/listingActions'
import { Box } from '@material-ui/core'

const GeneralFeatures = () => {
  const { state: { availableSize, system }, dispatch } = useContext<StorageListingContextProps>(StorageListingContext)
  // TODO: move to context
  const [peerId, setPeerId] = useState('')
  const [modalPeerIdOpened, setModalPeerIdOpened] = useState(false)

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
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={3}>
        <TextField
          select
          fullWidth
          required
          label="System"
          id="system-select"
          value={system}
          disabled
          InputProps={{
            style: { textAlign: 'center' },
          }}
        >
          <MenuItem value="IPFS">IPFS</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={3}>
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
          inputProps={{ style: { textAlign: 'center' } }}
        />
      </Grid>
      <Grid item xs={4} md={2}>
        <Button onClick={() => setModalPeerIdOpened(true)} color="primary" rounded>Get Peer ID</Button>
        <ModalDialogue title="Install and initialize the pinning service" open={modalPeerIdOpened} onClose={() => setModalPeerIdOpened(false)}>
          <Grid container justify="center">
            <Typography color="secondary">To get your Peer ID, please first run the following commands in your terminal</Typography>
            <Grid
              container
              style={{
                padding: 15, border: `1px solid ${colors.gray3}`, marginTop: 15, marginBottom: 15,
              }}
            >
              <Grid item xs={12}>
                <Typography align="center" color="secondary">$ npm install -g @rsksmart/rif-storage-pinner</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography align="center" component="div" color="secondary">
                  {'$ rif-pinner init --offerId <'}
                  <Box
                    display="inline"
                    style={{ color: colors.primary }}
                  >
                    {' '}
                    add here your account address
                  </Box>
                  {'>'}
                </Typography>
              </Grid>
            </Grid>
            <Typography gutterBottom component="div" color="secondary">
              Your
              <Box display="inline" fontWeight="fontWeightMedium">Peer ID</Box>
              {' '}
              will be generated in your terminal with the following format:
              {' '}
            </Typography>
            <Typography gutterBottom component="div" color="secondary">
              E.g.
              <Box display="inline" fontWeight="fontWeightMedium">QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N</Box>
            </Typography>
            <Typography gutterBottom color="secondary">Please copy it from the terminal and paste it in the Peer ID field of the form</Typography>
          </Grid>
        </ModalDialogue>
      </Grid>
    </Grid>
  )
}

export default GeneralFeatures

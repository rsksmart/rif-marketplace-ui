import Big from 'big.js'
import React, { FC, useState } from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import {
  Button, colors,
} from '@rsksmart/rif-ui'
import PinnerInstructionsModal from 'components/organisms/storage/sell/PinnerInstructionsModal'
import { StorageOffer } from 'models/marketItems/StorageItem'

type GeneralFeaturesProps = {
  originalOffer?: StorageOffer
  peerId: string
  totalCapacity: Big
  system: string
  onPeerIdChange: (value: string) => void
  onSizeChange: (value: string) => void
}

const GeneralFeatures: FC<GeneralFeaturesProps> = (
  {
    originalOffer, onPeerIdChange, onSizeChange, peerId, totalCapacity, system,
  },
) => {
  const utilizedCapacityGB = originalOffer?.utilizedCapacityGB.toNumber() ?? 0

  const [modalPeerIdOpened, setModalPeerIdOpened] = useState(false)
  const handleModalOpen = (): void => setModalPeerIdOpened(true)
  const handleModalClose = (): void => setModalPeerIdOpened(false)

  const handleSizeChange = ({ target: { value } }): void => {
    onSizeChange(value as string)
  }

  const handlePeerIdChange = ({ target: { value } }): void => {
    onPeerIdChange(value as string)
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
              label="Listed Size"
              id="listed-size"
              value={totalCapacity.toString()}
              onChange={handleSizeChange}
              error={Number(totalCapacity) <= utilizedCapacityGB}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="caption"
                      color="primary"
                    >
                      GB
                    </Typography>
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
            <Tooltip
              title="Different buyers can hire portions of the total size."
            >
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
          onChange={handlePeerIdChange}
          placeholder="Paste here your Peer ID"
          inputProps={{ style: { textAlign: 'center' } }}
          disabled={Boolean(originalOffer)}
        />
      </Grid>
      <Grid item xs={4} md={2}>
        <Button
          onClick={handleModalOpen}
          color="primary"
          rounded
        >
          Get Peer ID
        </Button>
        <PinnerInstructionsModal
          open={modalPeerIdOpened}
          onClose={handleModalClose}
        />
      </Grid>
    </Grid>
  )
}

export default GeneralFeatures

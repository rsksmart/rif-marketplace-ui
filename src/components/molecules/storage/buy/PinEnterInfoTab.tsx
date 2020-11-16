import {
  TextFieldProps, Typography, TextField,
  InputAdornment, MenuItem, SelectProps, Select,
} from '@material-ui/core'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import React, { FC } from 'react'
import { UNIT_PREFIX_POW2 } from 'utils/utils'

type Props = {
    size: TextFieldProps
    hash: TextFieldProps
    unit: SelectProps
}

const PinEnterInfoTab: FC<Props> = ({
  size, unit, hash,
}) => (
  <>
    <GridRow justify="center">
      <Typography variant="body2" color="secondary" style={{ width: '70%' }} align="center">
        To ensure that your file persists in IPFS is necessary to pin it using its hash
      </Typography>
    </GridRow>
    <GridRow spacing={3}>
      <GridItem xs={12}>
        <TextField
          InputProps={{
            inputProps: { min: 1 },
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  required
                  defaultValue={UNIT_PREFIX_POW2.MEGA}
                  {...unit}
                >
                  <MenuItem
                    value={UNIT_PREFIX_POW2.MEGA}
                  >
                    MB
                  </MenuItem>
                  <MenuItem
                    value={UNIT_PREFIX_POW2.GIGA}
                  >
                    GB
                  </MenuItem>
                </Select>
              </InputAdornment>
            ),
          }}
          type="number"
          id="contentSize"
          label="Content size"
          {...size}
          required
          fullWidth
        />
        <Typography variant="caption" color="secondary">
          Content size will always ROUND UP to the nearest MB integer.
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <TextField
          type="string"
          id="hash"
          label="Hash"
          required
          {...hash}
          fullWidth
        />

        <Typography variant="caption" color="secondary">
          You can find the hash of your file in your storage system (IPFS, SWARM)
        </Typography>
      </GridItem>
    </GridRow>

  </>
)

export default PinEnterInfoTab

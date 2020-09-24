import {
  TextFieldProps, Typography, TextField, InputAdornment, MenuItem, SelectProps, Select,
} from '@material-ui/core'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import React, { FC } from 'react'
import { UNIT_PREFIX_POW2 } from 'utils/utils'

type Props = {
    name: TextFieldProps
    size: TextFieldProps
    hash: TextFieldProps
    unit: SelectProps
}

const PinEnterInfoTab: FC<Props> = ({
  name, size, unit, hash,
}) => (
  <>
    <Typography variant="body2">
      To ensure that your file persists in IPFS is necessary to pin it using its hash
    </Typography>
    <GridRow
      justify="space-evenly"
      wrap="nowrap"
    >
      <GridItem>
        <TextField
          type="string"
          id="contentName"
          label="Content name"
          variant="outlined"
          {...name}
          required
        />
      </GridItem>
      <GridItem>
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  {...unit}
                >
                  {Object.keys(UNIT_PREFIX_POW2).filter((k) => !parseInt(k, 10)).map((k) => <MenuItem key={k} value={UNIT_PREFIX_POW2[k]}>{`${k[0]}B`}</MenuItem>)}
                </Select>
              </InputAdornment>
            ),
          }}
          type="number"
          id="contentSize"
          label="Content size"
          variant="outlined"
          {...size}
          required
        />
      </GridItem>
    </GridRow>
    <TextField
      type="string"
      id="hash"
      label="Hash"
      variant="outlined"
      required
      {...hash}
      style={{
        width: '100%',
      }}
    />
    <Typography variant="caption">
      You can find the hash of your file in your storage system (IPFS, SWARM)
    </Typography>
  </>
)

export default PinEnterInfoTab

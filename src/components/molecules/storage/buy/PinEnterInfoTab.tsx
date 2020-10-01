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

const isEmpty = (
  text: string | unknown,
): boolean => !text || !String(text).trim()

const PinEnterInfoTab: FC<Props> = ({
  name, size, unit, hash,
}) => (
  <>
    <GridRow justify="center">
      {/* .juraj - put inside classes */}
      <Typography variant="body2" color="secondary" style={{ width: '70%' }} align="center">
        To ensure that your file persists in IPFS is necessary to pin it using its hash
      </Typography>
    </GridRow>
    <GridRow spacing={3}>
      <GridItem xs={6}>
        <TextField
          error={isEmpty(name.value)}
          type="string"
          id="contentName"
          label="Content name"
          {...name}
          required
        />
      </GridItem>
      <GridItem xs={6}>
        <TextField
          error={isEmpty(size.value) || !parseFloat(size.value as string)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  required
                  defaultValue={UNIT_PREFIX_POW2.MEGA}
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
          {...size}
          required
          fullWidth
        />
      </GridItem>
      <GridItem xs={12}>
        <TextField
          error={isEmpty(hash.value)}
          type="string"
          id="hash"
          label="Hash"
          required
          {...hash}
          style={{
            width: '100%',
          }}
        />
        <Typography variant="caption" color="secondary">
          You can find the hash of your file in your storage system (IPFS, SWARM)
        </Typography>
      </GridItem>
    </GridRow>

  </>
)

export default PinEnterInfoTab

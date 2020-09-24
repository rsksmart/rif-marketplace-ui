import { TextFieldProps, Typography, TextField } from '@material-ui/core'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import React, { FC } from 'react'

type Props = {
    name: TextFieldProps
    size: TextFieldProps
    hash: TextFieldProps
}

const PinEnterInfoTab: FC<Props> = ({ name, size, hash }) => (
  <>
    <Typography variant="body2">
      To ensure that your file persists in IPFS is necessary to pin it using its hash
    </Typography>
    <GridRow
      justify="space-evenly"
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

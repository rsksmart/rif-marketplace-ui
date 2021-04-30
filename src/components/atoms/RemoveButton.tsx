import React, { FC } from 'react'
import { Typography } from '@material-ui/core'
import { SelectRowButton } from 'components/molecules'
import { SelectRowButtonProps } from 'components/molecules/SelectRowButton'
import { Close } from '@material-ui/icons'

const RemoveButton: FC<SelectRowButtonProps> = (props) => (
  <Typography align="right" gutterBottom color="primary">
    <SelectRowButton size="large" variant="text" {...props}><Close /></SelectRowButton>
  </Typography>
)

export default RemoveButton

import React, { FC } from 'react'
import {
  ButtonProps,
} from '@material-ui/core/Button'
import { Button } from '@rsksmart/rif-ui'

const RoundBtn: FC<ButtonProps> = ({ color = 'primary', variant = 'contained', ...otherProps }) => (
  <Button
    color={color}
    variant={variant}
    rounded
    shadow
    {...otherProps}
  />
)

export default RoundBtn

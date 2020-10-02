import React, { FC } from 'react'
import {
  ButtonProps,
} from '@material-ui/core'
import { Button } from '@rsksmart/rif-ui'

export type RoundBtnProps = Omit<ButtonProps, 'color' | 'variant'>

const RoundBtn: FC<RoundBtnProps> = (props) => (
  <Button
    color="primary"
    variant="contained"
    rounded
    shadow
    {...props}
  />
)

export default RoundBtn

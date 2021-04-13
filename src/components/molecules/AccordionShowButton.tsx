import { Typography } from '@material-ui/core'
import React, { FC } from 'react'

type Props = {
    show: boolean
    subject?: string
}
const AccordionShowButton: FC<Props> = ({ show, subject = '' }) => (
  <Typography align="right" color="primary" variant="body2">
    {show ? 'Hide ' : 'View '}
    {!!subject && ` ${subject}`}
  </Typography>
)

export default AccordionShowButton

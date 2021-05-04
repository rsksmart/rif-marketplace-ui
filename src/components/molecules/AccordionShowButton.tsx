import { Typography, TypographyProps } from '@material-ui/core'
import React, { FC } from 'react'

type Props = TypographyProps & {
    show: boolean
    subject?: string
}
const AccordionShowButton: FC<Props> = ({ show, subject = '', ...typographyProps }) => (
  <Typography align="right" color="primary" variant="body2" {...typographyProps}>
    {show ? 'Hide ' : 'View '}
    {Boolean(subject) && ` ${subject}`}
  </Typography>
)

export default AccordionShowButton

export type AccordionShowButtonProps = Props

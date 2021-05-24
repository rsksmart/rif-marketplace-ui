import React, { FC } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { theme } from '@rsksmart/rif-ui'
import closingCross from 'assets/images/closingCross.svg'
import { TypographyProps } from '@material-ui/core'

type Props = TypographyProps & {
    hoverText?: string
}

const CrossBtn: FC<Props> = ({ hoverText, ...props }) => (
  <Container style={{
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: '1em',
    height: '1em',
  }}
  >
    <Typography color="textSecondary" {...props}>
      <img src={closingCross} alt={hoverText ?? 'close'} />
    </Typography>
  </Container>

)
export default CrossBtn

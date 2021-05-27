import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { colors } from '@rsksmart/rif-ui'
import Card, { CardProps } from '@material-ui/core/Card'

export type RoundedCardProps = CardProps & {
  className?: string
  color?: 'primary' | 'secondary' | 'noBorder'
}

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 15,
    boxShadow: 'none',
  },
  primary: {
    border: `1px solid ${colors.primary}`,
  },
  secondary: {
    border: `1px solid ${colors.gray3}`,
  },
  noBorder: {
    border: 'none',
  },
}))

const RoundedCard: FC<RoundedCardProps> = ({
  className = '',
  color = 'secondary',
  children,
  ...props
}) => {
  const classes = useStyles()
  return (
    <Card className={`${classes.root} ${classes[color]} ${className}`} {...props}>
      {children}
    </Card>
  )
}

export default RoundedCard

import React, { FC } from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'
import { colors } from '@rsksmart/rif-ui'

export interface RoundedCardProps {
  className?: string
  color?: 'primary' | 'secondary'
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
}))

// TODO: move to rif-ui
const RoundedCard: FC<RoundedCardProps> = ({ className = '', color = 'secondary', children }) => {
  const classes = useStyles()
  return (
    <Card className={`${classes.root} ${classes[color]} ${className}`}>
      {children}
    </Card>
  )
}

export default RoundedCard

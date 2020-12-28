import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { colors, fonts } from '@rsksmart/rif-ui'

type ItemWUnitProps = {
  type: 'normalGrey' | 'mediumPrimary'
  value: string
  unit: string
}

const useStyles = makeStyles(() => ({
  priceItem: {
    whiteSpace: 'nowrap',
  },
  mediumPrimary: {
    color: colors.primary,
    fontSize: fonts.size.medium,
  },
  normalGrey: {
    color: colors.gray3,
    fontSize: fonts.size.normal,
  },
}))

const ItemWUnit: FC<ItemWUnitProps> = ({ type, value, unit }) => {
  const classes = useStyles()
  return (
    <Typography className={`${classes.priceItem} ${classes[type]}`}>
      {`${value} ${unit}`}
    </Typography>
  )
}

export default ItemWUnit

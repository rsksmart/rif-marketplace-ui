import React, { FC } from 'react'
import { withStyles } from '@material-ui/core'
import { colors, fonts } from '@rsksmart/rif-ui'

const styles = {
  mediumPrimary: {
    color: colors.primary,
    fontSize: fonts.size.medium,
  },
  normalGrey: {
    color: colors.gray3,
    fontSize: fonts.size.normal,
  },
}

interface StylesProps {
  classes: Record<keyof typeof styles, string>
}

export interface ItemWUnitProps extends StylesProps {
  type: keyof typeof styles
  value: string
  unit: string
}

const ItemWUnit: FC<ItemWUnitProps> = ({
  type, value, unit, classes,
}) => <span className={`price_item ${classes[type]}`}>{`${value} ${unit}`}</span>


export default withStyles(styles)(ItemWUnit)

import React, { FC } from 'react'
import {
  GridProps, TypographyProps, Typography,
} from '@material-ui/core'
import GridItem from 'components/atoms/GridItem'
import { Modify } from 'utils/typeUtils'
import { fonts } from '@rsksmart/rif-ui'
import GridRow from './GridRow'

export type LabelWithValueProps = Modify<GridProps,
    {
        label: string
        value: string
        labelProps?: TypographyProps
        valueProps?: TypographyProps
    }>

const LabelWithValue: FC<LabelWithValueProps> = ({
  label, value, labelProps, valueProps, ...props
}) => (
  <GridRow
    spacing={2}
    {...props}
  >
    <GridItem>
      <Typography
        color="primary"
        align="center"
        {...labelProps}
      >
        {label}
      </Typography>
    </GridItem>
    <GridItem>
      <Typography
        color="secondary"
        align="center"
        style={{
          fontSize: fonts.size.subtitleSmall,
        }}
        {...valueProps}
      >
        {value}
      </Typography>
    </GridItem>
  </GridRow>
)

export default LabelWithValue

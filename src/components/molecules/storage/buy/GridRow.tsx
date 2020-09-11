import React, { FC } from 'react'
import BaseGridRow, { GridRowProps } from 'components/atoms/GridRow'

const GridRow: FC<GridRowProps> = ({ ...props }) => (
  <BaseGridRow
    alignItems="baseline"
    justify="flex-start"
    wrap="nowrap"
    style={{
      paddingBlockEnd: '1.5em',
    }}
    spacing={5}
    {...props}
  />
)

export default GridRow

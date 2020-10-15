import React, { FC } from 'react'
import { GridProps, Grid } from '@material-ui/core'

export type GridRowProps = Omit<GridProps, 'direction' | 'container' | 'item'>

const GridRow: FC<GridRowProps> = ({ children, ...props }) => (
  <Grid
    container
    direction="row"
    {...props}
  >
    {children}
  </Grid>
)

export default GridRow

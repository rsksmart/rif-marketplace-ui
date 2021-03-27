import React, { FC } from 'react'
import Grid, { GridProps } from '@material-ui/core/Grid'

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

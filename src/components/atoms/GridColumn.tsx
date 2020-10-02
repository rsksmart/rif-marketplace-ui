import React, { FC } from 'react'
import { GridProps, Grid } from '@material-ui/core'

export type GridColumnProps = Omit<GridProps, 'direction' | 'container' | 'item'>

const GridColumn: FC<GridColumnProps> = ({ children, ...props }) => (
  <Grid
    container
    direction="column"
    {...props}
  >
    {children}
  </Grid>
)

export default GridColumn

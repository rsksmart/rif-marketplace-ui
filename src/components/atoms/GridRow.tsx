import React, { FC } from 'react'
import { GridProps, Grid } from '@material-ui/core'

export type GridRowProps = Omit<GridProps, 'direction' | 'container' | 'item'>

const GridRow: FC<GridRowProps> = ({ children, ...props }) => (
  <Grid
    container
    direction="row"
    {...props}
  >
    {/* {React.Children.map(children, (child) => <Grid item>{child}</Grid>)} */}
    {children}
  </Grid>
)

export default GridRow

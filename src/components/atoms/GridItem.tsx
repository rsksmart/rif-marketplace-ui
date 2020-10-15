import React, { FC } from 'react'
import { GridProps, Grid } from '@material-ui/core'

export type GridItemProps = Omit<GridProps, 'direction' | 'container' | 'item'>

const GridItem: FC<GridItemProps> = (
  { children, ...props },
) => <Grid item {...props}>{children}</Grid>

export default GridItem

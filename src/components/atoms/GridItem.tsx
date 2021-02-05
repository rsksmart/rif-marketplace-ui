import React, { FC } from 'react'
import Grid, { GridProps } from '@material-ui/core/Grid'

export type GridItemProps = Omit<GridProps, 'direction' | 'container' | 'item'>

const GridItem: FC<GridItemProps> = (
  { children, ...props },
) => <Grid item {...props}>{children}</Grid>

export default GridItem

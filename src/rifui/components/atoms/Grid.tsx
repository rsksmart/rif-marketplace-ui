import React, { FC } from 'react';
import { Grid as MUIGrid, GridProps as MUIGridProps } from '@material-ui/core';

export interface GridProps extends MUIGridProps { };

const Grid: FC<GridProps> = ({ children, ...rest }) => {
  return (
    <MUIGrid {...rest}>
      {children}
    </MUIGrid>
  );
};

export default Grid;

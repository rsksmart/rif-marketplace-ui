import React, { FC } from 'react';
import { CardActions as MUICardActions, CardActionsProps as MUICardActionsProps } from '@material-ui/core';

export interface CardProps extends MUICardActionsProps { };

const CardActions: FC<CardProps> = ({ children, ...rest }) => {
  return (
    <MUICardActions {...rest}>
      {children}
    </MUICardActions>
  );
}

export default CardActions;
import React, { FC } from 'react';
import { CardContent as MUICardContent, CardContentProps as MUICardContentProps } from '@material-ui/core';

export interface CardProps extends MUICardContentProps { };

const CardContent: FC<CardProps> = ({ children, ...rest }) => {
  return (
    <MUICardContent {...rest}>
      {children}
    </MUICardContent>
  );
}

export default CardContent;
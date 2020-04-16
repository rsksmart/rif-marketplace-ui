import React, { FC } from 'react';
import { CardHeader as MUICardHeader, CardHeaderProps as MUICardHeaderProps } from '@material-ui/core';

export interface CardProps extends MUICardHeaderProps { };

const CardHeader: FC<CardProps> = ({ children, ...rest }) => {
  return (
    <MUICardHeader {...rest}>
      {children}
    </MUICardHeader>
  );
}

export default CardHeader;
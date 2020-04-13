import React, { FC } from 'react';
import { Card as MUICard, CardProps as MUICardProps } from '@material-ui/core';

export interface CardProps extends MUICardProps { };

const Card: FC<CardProps> = ({ children, ...rest }) => {
  return (
    <MUICard {...rest}>
      {children}
    </MUICard>
  );
}

export default Card;
import React, { FC } from 'react';
import { Typography } from '../typography';

export interface ModalTitleProps {
  className?: string;
};

const ModalTitle: FC<ModalTitleProps> = ({ children, ...rest }) => {
  return (
    <Typography variant='h5' {...rest}>
      {children}
    </Typography>
  );
};

export default ModalTitle;

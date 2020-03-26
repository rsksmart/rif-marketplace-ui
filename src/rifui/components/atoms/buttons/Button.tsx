import React, { FC } from 'react';
import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@material-ui/core';

interface IButtonProps extends MUIButtonProps { };

const Button: FC<IButtonProps> = ({ children, ...rest }) => {
  return (
    <MUIButton {...rest}>
      {children}
    </MUIButton>
  );
}

export default Button;
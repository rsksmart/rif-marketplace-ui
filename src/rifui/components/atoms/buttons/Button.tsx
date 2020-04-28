import React, { FC } from 'react';
import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface ButtonProps extends MUIButtonProps {
  block?: boolean;
  shadow?: boolean;
  rounded?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  block: {
    width: '100%'
  },
  noShadow: {
    boxShadow: 'none'
  },
  rounded: {
    borderRadius: 50,
  },
}));

const Button: FC<ButtonProps> = ({ className = '', block, shadow, rounded, children, ...rest }) => {
  const classes = useStyles();

  return (
    <MUIButton
      className={
        `${rounded ? classes.rounded : ''}
        ${shadow ? '' : classes.noShadow}
        ${block ? classes.block : ''} ${className}`.trim()
      }
      {...rest}>
      {children}
    </MUIButton >
  );
}

export default Button;
import React, { FC } from 'react';
import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface IButtonProps extends MUIButtonProps {
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

const Button: FC<IButtonProps> = ({ className = '', block, shadow, rounded, children, ...rest }) => {
  const classes = useStyles();

  return (
    <MUIButton
      className={
        `${{ [classes.rounded]: rounded }}
        ${{ [classes.noShadow]: shadow }}
        ${{ [classes.block]: block }} ${className}`
      }
      {...rest}>
      {children}
    </MUIButton >
  );
}

export default Button;
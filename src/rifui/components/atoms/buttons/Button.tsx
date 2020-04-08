import React, { FC } from 'react';
import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface IButtonProps extends MUIButtonProps {
  block?: boolean;
  rounded?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  block: {
    width: '100%'
  },
  rounded: {
    borderRadius: 50,
  },
}));

const Button: FC<IButtonProps> = ({ className = '', block, rounded, children, ...rest }) => {
  const classes = useStyles();

  return (
    // TODO: consider using classnames library to conditionally render classes (https://github.com/JedWatson/classnames)
    <MUIButton className={`${rounded ? classes.rounded : ''} ${block ? classes.block : ''} ${className}`}
      {...rest}>
      {children}
    </MUIButton >
  );
}

export default Button;
import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { Button } from 'rifui';

export interface LoginOptionProps {
  className?: string;
  onClick: () => void;
  text: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 5,
    margin: 5,
    width: '100%'
  }
}));

const LoginOption: FC<LoginOptionProps> = ({ className = '', onClick, text, ...rest }) => {
  const classes = useStyles();
  return (
    <Button
      className={`${classes.root} ${className}`}
      block rounded variant='outlined' color='primary'
      onClick={onClick}>{text}</Button>
  );
};

export default LoginOption;

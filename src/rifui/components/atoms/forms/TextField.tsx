import React, { FC } from 'react';
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps, makeStyles, Theme } from '@material-ui/core'
import { colors } from 'rifui/theme';

export type TextFieldProps = MUITextFieldProps;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: colors.gray3,
    '&:hover': {
      color: colors.gray2,
    },
  },
}));

const TextField: FC<TextFieldProps> = ({ className = '', ...rest }) => {
  const classes = useStyles();
  return <MUITextField className={`${classes.root} ${className}`.trim()} {...rest} />;
}

export default TextField;

import React, { FC } from 'react';
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps, makeStyles } from '@material-ui/core'
import { colors } from '../../../theme';

export type TextFieldProps = MUITextFieldProps;

const useStyles = makeStyles(() => ({
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

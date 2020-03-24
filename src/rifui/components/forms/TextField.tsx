import React, { FC } from 'react';
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@material-ui/core'

export type TextFieldProps = MUITextFieldProps;

const TextField: FC<TextFieldProps> = props => {
  return <MUITextField {...props} />;
}

export default TextField;

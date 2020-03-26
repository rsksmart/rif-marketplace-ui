import React, { FC, useState } from 'react';
import { FormControl as MUIFormControl, FormControlProps as MUIFormControlProps } from '@material-ui/core';

export interface IFormControlProps extends MUIFormControlProps { }

const FormControl: FC<IFormControlProps> = ({ ...rest }) => {
  return (
    <MUIFormControl {...rest}>
      ...children
    </MUIFormControl>
  );
}

export default FormControl;
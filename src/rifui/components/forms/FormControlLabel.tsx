import React, { FC } from 'react';
import { FormControlLabel as MUIFormControlLabel, FormControlLabelProps as MUIFormControlLabelProps } from '@material-ui/core';

export type IFormControlLabelProps = MUIFormControlLabelProps;

const FormControlLabel: FC<IFormControlLabelProps> = rest => {
  return <MUIFormControlLabel {...rest} />;
};

export default FormControlLabel;

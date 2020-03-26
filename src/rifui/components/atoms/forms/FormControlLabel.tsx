import React, { FC } from 'react';
import { FormControlLabel as MUIFormControlLabel, FormControlLabelProps as MUIFormControlLabelProps } from '@material-ui/core';

export interface FormControlLabelProps extends MUIFormControlLabelProps { };

const FormControlLabel: FC<FormControlLabelProps> = rest => {
  return <MUIFormControlLabel {...rest} />;
};

export default FormControlLabel;

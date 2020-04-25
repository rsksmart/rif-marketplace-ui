import React, { FC } from 'react';
import {
  FormControlLabel as MUIFormControlLabel,
  FormControlLabelProps as MUIFormControlLabelProps,
  makeStyles, createStyles,
} from '@material-ui/core';
import { colors } from '../../../theme';

export interface FormControlLabelProps extends MUIFormControlLabelProps { };

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      color: colors.gray3
    }
  })
);

const FormControlLabel: FC<FormControlLabelProps> = ({ className = '', ...rest }) => {
  const classes = useStyles();

  return <MUIFormControlLabel className={`${classes.root} ${className} `.trim()} {...rest} />;
};

export default FormControlLabel;

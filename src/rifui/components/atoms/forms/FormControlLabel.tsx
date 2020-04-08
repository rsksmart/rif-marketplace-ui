import React, { FC } from 'react';
import {
  FormControlLabel as MUIFormControlLabel,
  FormControlLabelProps as MUIFormControlLabelProps,
  makeStyles, createStyles,
  Theme
} from '@material-ui/core';
import { colors } from 'rifui/theme';

export interface FormControlLabelProps extends MUIFormControlLabelProps { };

const useStyles = makeStyles((theme: Theme) =>
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

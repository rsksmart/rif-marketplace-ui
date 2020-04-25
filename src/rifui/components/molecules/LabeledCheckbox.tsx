import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Checkbox, { CheckboxProps } from '../atoms/forms/Checkbox';
import FormControlLabel from '../atoms/forms/FormControlLabel';
import { colors } from '../../theme';

export interface LabeledCheckboxProps extends CheckboxProps {
  labelText: string;
  labelClassName?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: colors.gray4,
    width: "100%",
  },
}));

const LabeledCheckbox: FC<LabeledCheckboxProps> = ({ labelText, labelClassName = '', ...rest }) => {
  const classes = useStyles();
  return (
    <FormControlLabel
      className={`${classes.root} ${labelClassName.trim()}`}
      label={labelText}
      control={
        <Checkbox {...rest} />
      } />

  );
}

export default LabeledCheckbox;

import React, { FC } from 'react';
import Checkbox, { CheckboxProps } from '../atoms/forms/Checkbox';
import FormControlLabel from '../atoms/forms/FormControlLabel';

export interface LabeledCheckboxProps extends CheckboxProps {
  label: string;
  labelClassName?: string;
}

const LabeledCheckbox: FC<LabeledCheckboxProps> = ({ label, labelClassName, ...rest }) => {
  return (
    <FormControlLabel
      className={labelClassName}
      label={label}
      control={
        <Checkbox {...rest} />
      } />

  );
}

export default LabeledCheckbox;

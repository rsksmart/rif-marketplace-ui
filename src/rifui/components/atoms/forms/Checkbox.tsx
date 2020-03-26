import React, { FC, useState } from 'react';
import { Checkbox as MUICheckbox, CheckboxProps as MUICheckboxProps } from '@material-ui/core';

export interface ICheckboxProps extends MUICheckboxProps { }

const Checkbox: FC<ICheckboxProps> = props => {
  const [checked, setChecked] = useState(!!props.checked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  }

  return <MUICheckbox {...props} checked={checked} onChange={handleChange} />
}

export default Checkbox;

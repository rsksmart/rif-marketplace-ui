import React, { FC, useState } from 'react';
import { Checkbox as MUICheckbox, CheckboxProps as MUICheckboxProps } from '@material-ui/core';

export interface ICheckboxProps extends MUICheckboxProps { }

const Checkbox: FC<ICheckboxProps> = props => {
  const [isChecked, setIsChecked] = useState(!!props.checked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    setIsChecked(checked);

    const { onChange } = props;
    !!onChange && onChange(event, checked);
  }

  return <MUICheckbox {...props} checked={isChecked} onChange={handleChange} />
}

export default Checkbox;

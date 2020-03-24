import React, { FC } from 'react';
import { Checkbox, FormControlLabel, IFormControlLabelProps, ICheckboxProps } from 'rifui';

export interface IFilterCheckboxCardProps {
  className?: string;
  items: ILabeledCheckboxProps[];
}

export interface ILabeledCheckboxProps extends ICheckboxProps {
  label?: string;
}

const FilterCheckboxCard: FC<IFilterCheckboxCardProps> = ({ className = '', items }) => {
  return (
    <div className={className}>
      {items.map((item: ILabeledCheckboxProps, i) => (
        <FormControlLabel
          key={`fcl-${item.id}` || `fcl-${i}-${className.trim()}`}
          className={item.className}
          label={item.label}
          control={
            <Checkbox key={`cb-${item.id}` || `cbf-${i}-${className.trim()}`} {...item} checked={item.checked} />
          } />
      ))}
    </div>
  )
}

export default FilterCheckboxCard;

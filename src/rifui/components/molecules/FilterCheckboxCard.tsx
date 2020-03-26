import React, { FC } from 'react';
import Checkbox, { ICheckboxProps } from '../atoms/forms/Checkbox';
import FormControlLabel from '../atoms/forms/FormControlLabel';
import LabeledCheckbox, { LabeledCheckboxProps } from './LabeledCheckbox';

export interface FilterCheckboxCardProps {
  className?: string;
  items: LabeledCheckboxProps[];
}

const FilterCheckboxCard: FC<FilterCheckboxCardProps> = ({ className = '', items }) => {
  return (
    <div className={className}>
      {items.map((item: LabeledCheckboxProps, i) => (
        <LabeledCheckbox
          key={`lc-${item.id}` || `lc-${i}-${className.trim()}`}
          labelClassName={item.labelClassName}
          {...item}
        />
      ))}
    </div>
  )
}

export default FilterCheckboxCard;

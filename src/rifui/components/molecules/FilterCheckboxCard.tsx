import React, { FC } from 'react';
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
          key={`labeledCheckbox-${item.id}` || `labeledCheckbox-${i}-${className}`.trim()}
          labelClassName={item.labelClassName}
          {...item}
        />
      ))}
    </div>
  )
}

export default FilterCheckboxCard;

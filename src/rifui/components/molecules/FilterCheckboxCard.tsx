import React, { FC } from 'react';
import LabeledCheckbox, { LabeledCheckboxProps } from './LabeledCheckbox';

export interface FilterCheckboxCardProps {
  className?: string;
  items: LabeledCheckboxProps[];
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const FilterCheckboxCard: FC<FilterCheckboxCardProps> = ({ className = '', onClick, items }) => {
  return (
    <div className={className}>
      {items.map((item: LabeledCheckboxProps, i) => (
        <LabeledCheckbox
          onClick={onClick}
          key={`labeledCheckbox-${item.id}` || `labeledCheckbox-${i}-${className}`.trim()}
          labelClassName={item.labelClassName}
          {...item}
        />
      ))}
    </div>
  )
}

export default FilterCheckboxCard;

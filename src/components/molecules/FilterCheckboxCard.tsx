import Checkbox, { CheckboxProps } from 'components/atoms/forms/Checkbox';
import React, { FC } from 'react';
import {} from 'react-bootstrap';

export interface FilterCheckboxCardProps {
  className?: string;
  items: CheckboxProps[];
}

const FilterCheckboxCard: FC<FilterCheckboxCardProps> = ({
  className = '',
  items,
}) => {
  return (
    <div className={('filter-checkbox-card ' + className).trim()}>
      {items.map((item: CheckboxProps, i) => (
        <Checkbox {...item} key={item.id || i} />
      ))}
    </div>
  );
};

export default FilterCheckboxCard;

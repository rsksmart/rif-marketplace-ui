import React, { FC } from 'react';
import { Container } from 'react-bootstrap';
import {} from 'react-bootstrap';
import Checkbox, { CheckboxProps } from 'components/atoms/forms/Checkbox';

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
      <Container>
        {items.map((item: CheckboxProps) => (
          <Checkbox {...item} />
        ))}
      </Container>
    </div>
  );
};

export default FilterCheckboxCard;

import React from 'react';
import { Accordion, FilterCheckboxCard } from '@rsksmart/rif-ui';
import { LabeledCheckboxProps } from '@rsksmart/rif-ui/dist/components/molecules/LabeledCheckbox';

export interface SelectFilterProps {
  className?: string;
  title: string;
  items: LabeledCheckboxProps[];
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const SelectFilter = ({ className = '', title, ...rest }: SelectFilterProps) => {
  return <Accordion
    id={title.toLocaleLowerCase()}
    className={`${title} ${className}`}
    expanded={true}
    title={title}>
    <FilterCheckboxCard {...rest} />
  </Accordion>
}

export default SelectFilter;
import React from 'react';
import { Accordion } from '@rsksmart/rif-ui';
import { FormControlLabelProps, RadioGroup, RadioGroupProps, FormControlLabel, Radio } from '@material-ui/core';

export interface RadioFilterProps extends RadioGroupProps {
  className?: string;
  title: string;
  items: Omit<FormControlLabelProps, 'control'>[];
}

const RadioFilter = ({ className = '', title, items, ...rest }: RadioFilterProps) => {
  return <Accordion
    id={title.toLocaleLowerCase()}
    className={`${title} ${className}`}
    expanded={true}
    title={title}>
    <RadioGroup {...rest}>
      {items.map(itemProps => <FormControlLabel key={itemProps.value as string} {...itemProps} control={<Radio />} />)}
    </RadioGroup>
  </Accordion>
}

export default RadioFilter;
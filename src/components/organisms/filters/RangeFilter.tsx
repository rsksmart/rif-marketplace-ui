import React, { FC } from 'react'
import { Accordion, RangeSliderWithInputs } from 'rifui';
import { RangeSliderWithInputsProps } from 'rifui/components/molecules/RangeSliderWithInputs';

export interface RangeFilterProps extends RangeSliderWithInputsProps {
  className?: string
  title: string
  edgeValues: {
    min: number,
    max: number
  },
}

const RangeFilter: FC<RangeFilterProps> = ({ className = '', title, edgeValues, ...rest }) => {

  return <Accordion
    id={`accordion-${title.toLocaleLowerCase()}`}
    className={className}
    expanded={true}
    title={title}
  >
    <RangeSliderWithInputs
      min={edgeValues.min}
      max={edgeValues.max}
      {...rest}
    />
  </Accordion>
}

export default RangeFilter;
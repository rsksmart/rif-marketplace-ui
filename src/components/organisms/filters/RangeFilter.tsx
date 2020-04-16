import React, { FC } from 'react'
import { Accordion, RangeSliderWithInputs } from 'rifui';
import { RangeSliderWithInputsProps } from 'rifui/components/molecules/RangeSliderWithInputs';

export interface RangeFilterProps extends RangeSliderWithInputsProps {
  className?: string
  title: string
  hedgeValues: {
    min: number,
    max: number
  },
}

const RangeFilter: FC<RangeFilterProps> = ({ className = '', title, hedgeValues, ...rest }) => {

  return <Accordion
    id={`accordion-${title.toLocaleLowerCase()}`}
    className={className}
    expanded={true}
    title={title}
  >
    <RangeSliderWithInputs
      min={hedgeValues.min}
      max={hedgeValues.max}
      {...rest}
    />
  </Accordion>
}

export default RangeFilter;
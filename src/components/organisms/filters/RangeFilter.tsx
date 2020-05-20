import React, { FC } from 'react'
import { Accordion, RangeSliderWithInputs } from '@rsksmart/rif-ui'
import { RangeSliderWithInputsProps } from '@rsksmart/rif-ui/dist/components/molecules/RangeSliderWithInputs'

export interface RangeFilterProps extends RangeSliderWithInputsProps {
  className?: string
  title: string
  edgeValues: {
    min: number
    max: number
  }
}

const RangeFilter: FC<RangeFilterProps> = ({
  className = '', title, edgeValues, ...rest
}) => (
  <Accordion
    id={`accordion-${title.toLocaleLowerCase()}`}
    className={className}
    expanded
    title={title}
  >
    <RangeSliderWithInputs
      min={edgeValues.min}
      max={edgeValues.max}
      {...rest}
    />
  </Accordion>
)

export default RangeFilter

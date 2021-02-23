import React, { FC } from 'react'
import { Accordion } from '@rsksmart/rif-ui'
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup'
import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'

export type RadioFilterProps = RadioGroupProps & {
  className?: string
  title: string
  items: Array<Omit<FormControlLabelProps, 'control'>>
}

const RadioFilter: FC<RadioFilterProps> = ({
  className = '', title, items, ...rest
}: RadioFilterProps) => (
  <Accordion
    id={title.toLocaleLowerCase()}
    className={`${title} ${className}`}
    expanded
    title={title}
  >
    <RadioGroup {...rest}>
      {items.map(
        (itemProps) => (
          <FormControlLabel
            key={itemProps.value as string}
            {...itemProps}
            control={<Radio color="primary" />}
          />
        ),
      )}
    </RadioGroup>
  </Accordion>
)

export default RadioFilter

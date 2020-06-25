import React from 'react'
import { Accordion, Checkbox } from '@rsksmart/rif-ui'
import { FormControlLabel, FormControlLabelProps } from '@material-ui/core'

export interface SelectFilterProps {
  className?: string
  title: string
  items: Omit<FormControlLabelProps, 'control'>[]
}

const SelectFilter = ({ className = '', title, items }: SelectFilterProps) => (
  <Accordion
    id={title.toLocaleLowerCase()}
    className={className}
    expanded
    title={title}
  >
    {items.map((itemProps) =>
      <FormControlLabel
        key={itemProps.value as string}
        {...itemProps}
        control={<Checkbox />}
      />)}

    {/* <FilterCheckboxCard {...rest} /> */}
  </Accordion>
)

export default SelectFilter

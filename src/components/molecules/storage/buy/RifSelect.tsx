import { Select, MenuItem, SelectProps } from '@material-ui/core'
import React from 'react'

type OptionType = JSX.Element | string

export type RifSelectProps<T extends OptionType> = SelectProps & {
    id: string
    options: T[] | undefined
}

function RifSelect<T extends OptionType>({
  id, options, ...props
}: RifSelectProps<T>): React.ReactElement {
  return (
    <Select
      labelId={`${id}-select`}
      id={`${id}-select`}
      {...props}
    >
      {options?.map((option: any, i) => (
        <MenuItem
          key={option.key || option}
          value={i}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  )
}

export default RifSelect

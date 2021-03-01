import { Select, MenuItem, SelectProps } from '@material-ui/core'
import React from 'react'

type OptionType = JSX.Element | string

export type RifSelectProps<T extends OptionType> = SelectProps & {
  id: string
  options: T[] | undefined
}

const hasKey = (
  obj: OptionType,
): obj is JSX.Element => typeof obj !== 'string' &&
  obj.key !== undefined

function RifSelect<T extends OptionType> ({
  id, options, ...props
}: RifSelectProps<T>): React.ReactElement {
  return (
    <Select
      labelId={`${id}-select`}
      id={`${id}-select`}
      {...props}
    >
      {options?.map((option: T, i) => (
        <MenuItem
          key={hasKey(option) ? option.key : option as string}
          value={i}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  )
}

export default RifSelect

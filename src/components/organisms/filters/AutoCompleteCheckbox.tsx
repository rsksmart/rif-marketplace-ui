import React, { FC } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

export interface AutoCompleteCheckboxProps {
  options: Array<{ labelText: string, id: string }>
}

const AutoCompleteCheckbox: FC<AutoCompleteCheckboxProps> = ({ options }) => (
  <Autocomplete
    multiple
    id="checkboxes-tags-demo"
    options={options}
    disableCloseOnSelect
    getOptionLabel={(option) => option.labelText}
    renderOption={(option, { selected }) => (
      <>
        <Checkbox
          color="primary"
          style={{ marginRight: 8 }}
          checked={selected}
        />
        {option.labelText}
      </>
    )}
    style={{ width: '100%' }}
    renderInput={(params) => (
      <TextField {...params} variant="outlined" label="Prefered locations" placeholder="Select your prefered locations" />
    )}
  />
)

export default AutoCompleteCheckbox

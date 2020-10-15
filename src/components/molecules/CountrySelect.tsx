import React, { FC } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { CountryType, countries, countryToFlag } from 'models/Country'

export interface CountrySelectProps {
  onChange?: (value: CountryType | null) => void
}

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
})

const CountrySelect: FC<CountrySelectProps> = ({ onChange }) => {
  const classes = useStyles()

  const onCountryChange = (_event: any, value: CountryType | null) => {
    if (onChange) onChange(value)
  }

  return (
    <Autocomplete
      onChange={onCountryChange}
      style={{ width: '100%' }}
      options={countries as CountryType[]}
      classes={{
        option: classes.option,
      }}
      autoHighlight
      getOptionLabel={(option) => option.name}
      renderOption={(option) => (
        <>
          <span>{countryToFlag(option.code)}</span>
          {option.name}
          {' '}
          (
          {option.code}
          )
        </>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a country"
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}

export default CountrySelect

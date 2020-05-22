import React, { FC, useState } from 'react'
import {
  InputAdornment, makeStyles, TextField, Theme, createStyles,
} from '@material-ui/core'
import {
  colors,
} from '@rsksmart/rif-ui'
import Search from '@material-ui/icons/Search'

export interface SearchFilterProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  value: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    // added the border at root level so we can easily display it or not on hover and focus
    border: `1px solid ${colors.gray3}`,
    borderRadius: 50,
    textAlign: 'center',
    width: '100%',
    '&:hover': {
      border: `1px solid ${colors.primary} !important`,
    },
    '&:focused': {
      border: `1px solid ${colors.primary} !important`,
    },
  },
  input: {
    borderRadius: 50,
    textAlign: 'center',
    color: colors.gray4,
  },
  innerInput: {
    // keep the text centered whit an adornment at the beginning
    padding: theme.spacing(1.2, 0, 1.2, 0),
    width: '100%',
  },
  // suppressed the border at textField level
  notchedOutline: {
    border: `0px solid ${colors.transparent} !important`,
  },
  searchIcon: {
    color: colors.gray3,
  },
}))

const SearchFilter: FC<SearchFilterProps> = ({ onChange, ...rest }) => {
  const classes = useStyles()

  // we only want to display the adornment (search icon) when the textfield is not focused and empty
  const [adornmentHidden, setAdornmentHidden] = useState(false)

  const handleOnFocus = () => setAdornmentHidden(true)
  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!event.target.value.length) setAdornmentHidden(false)
  }

  // These props come from MUI thus disabled eslint rule
  /* eslint-disable react/jsx-no-duplicate-props */
  return (
    <TextField
      className={classes.root}
      onFocus={handleOnFocus}
      inputProps={{
        className: classes.innerInput,
      }}
      InputProps={{
        classes: {
          notchedOutline: classes.notchedOutline,
        },
        className: classes.input,
        startAdornment: (
          <InputAdornment hidden={adornmentHidden} position="start">
            <Search className={classes.searchIcon} />
          </InputAdornment>),
      }}
      name="search"
      onBlur={handleOnBlur}
      onChange={onChange}
      {...rest}
      placeholder="Search your domain"
      variant="outlined"
    />
  )
}

export default SearchFilter

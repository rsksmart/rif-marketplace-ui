import React, { FC, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import {
  InputAdornment,
  TextField
} from 'rifui';
import { Search } from 'rifui/icons'
import { colors } from 'rifui/theme';

export interface SearchFilterProps {
  onChange: (event: React.FormEvent<Element>) => void;
};

// TODO: remove gray border when focused but not hovered
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // added the border at root level so we can easily display it or not on hover and focus
      border: `1px solid ${colors.gray3}`,
      borderRadius: 50,
      textAlign: 'center',
      width: '100%',
      '& .MuiOutlinedInput-root': {
        '&:hover': {
          border: `1px solid ${colors.primary} !important`
        },
      },
      '& .Mui-focused': {
        border: `1px solid ${colors.primary} !important`
      },
      '&:hover': {
        border: `0px !important`
      },
      '&:focus': {
        border: `0px !important`
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
    }
  })
);

const SearchFilter: FC<SearchFilterProps> = ({ onChange, ...rest }) => {
  const classes = useStyles();

  // we only want to display the adornment (search icon) when the textfield is not focused and empty
  const [adornmentHidden, setAdornmentHidden] = useState(false);

  const handleOnFocus = () => setAdornmentHidden(true);
  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!event.target.value.length)
      setAdornmentHidden(false)
  }

  return (
    <TextField
      className={classes.root}
      onFocus={handleOnFocus}
      inputProps={{
        className: classes.innerInput,
      }}
      InputProps={{
        classes: {
          notchedOutline: classes.notchedOutline
        },
        className: classes.input,
        startAdornment: (
          <InputAdornment hidden={adornmentHidden} position="start">
            <Search style={{ color: colors.gray3 }} />
          </InputAdornment>)
      }}
      name="search"
      onBlur={handleOnBlur}
      onChange={onChange}
      {...rest}
      placeholder="Search your domain"
      variant="outlined"
    />
  );
};

export default SearchFilter;

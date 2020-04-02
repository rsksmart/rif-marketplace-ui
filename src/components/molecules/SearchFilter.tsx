import React, { FC } from 'react';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
  })
);

const SearchFilter: FC<SearchFilterProps> = ({ onChange, ...rest }) => {
  const classes = useStyles();
  return (
    <TextField
      className={classes.root}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search style={{ color: colors.gray3 }} />
          </InputAdornment>)
      }}
      name="search"
      onChange={onChange}
      {...rest}
      placeholder="Search your domain"
      variant="outlined"
    />
  );
};

export default SearchFilter;

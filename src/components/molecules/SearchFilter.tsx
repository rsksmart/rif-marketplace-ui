import React, { FC } from 'react';
import {
	FormControl,
	InputAdornment,
	TextField
} from 'rifui';
import { Search } from 'rifui/icons'
import { colors } from 'rifui/theme';

export interface SearchFilterProps {
	onChange: any;
};

const SearchFilter: FC<SearchFilterProps> = ({ onChange, ...rest }) => {
	return (
		<FormControl style={{ width: '100%' }}>
			<TextField onChange={onChange} {...rest} InputProps=
				{{
					startAdornment: (
						<InputAdornment position="start">
							<Search style={{ color: colors.gray }} />
						</InputAdornment>)
				}}
				name="search"
				variant="outlined"
				placeholder="Search your domain"
				style={{ width: '100%' }}
				className='w-100' />
		</FormControl>
	);
};

export default SearchFilter;

import MarketFilterItem from 'components/molecules/MarketFilterItem';
import React, { FC } from 'react';
import { TextField } from 'rifui';

export interface SearchFilterProps extends React.HTMLAttributes<HTMLElement> {
    className?: string,
    label?: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const SearchFilter: FC<SearchFilterProps> = ({ label = 'Search', className = '', value, onChange }) => {
    return <MarketFilterItem name={label}>
        <TextField onChange={onChange} value={value} name="search" label={label} className={`w-100 ${className}`} />
    </MarketFilterItem>
}

export default SearchFilter
import React, { FC, FormEvent, HTMLAttributes } from 'react';
import {
  InputGroup,
  FormControl,
  InputGroupAppend,
  InputGroupText,
} from 'components/atoms/forms';

export interface FilterInputProps extends HTMLAttributes<HTMLInputElement> {
  value: string;
  handleChange?: (event: FormEvent) => void;
  append: string;
  name: string;
}

const FilterInput: FC<FilterInputProps> = ({
  value,
  append,
  handleChange,
  name,
}) => {
  return (
    <InputGroup
      className="mb-2"
      style={{
        background: '#E5E5E5',
        border: '1px solid #919191',
        boxSizing: 'border-box',
      }}
    >
      <FormControl value={value} onChange={handleChange} name={name} />
      <InputGroupAppend>
        <InputGroupText>{append}</InputGroupText>
      </InputGroupAppend>
    </InputGroup>
  );
};

export default FilterInput;

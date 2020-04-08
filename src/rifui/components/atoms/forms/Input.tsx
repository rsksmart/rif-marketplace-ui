import React, { FC } from 'react';
import { Input as MUIInput, InputProps as MUIInputProps } from '@material-ui/core';

export interface InputProps extends MUIInputProps { };

const Input: FC<InputProps> = ({ children, ...rest }) => {
	return (
		<MUIInput {...rest}>
			{children}
		</MUIInput>
	);
};

export default Input;

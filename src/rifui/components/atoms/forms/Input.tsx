import React, { FC } from 'react';
import { Input as MUIInput, InputProps as MUIInputProps } from '@material-ui/core';
import { colors } from 'rifui/theme';

export interface InputProps extends MUIInputProps { };

const Input: FC<InputProps> = ({ children, ...rest }) => {
	return (
		<MUIInput style={{ backgroundColor: colors.gray3 }} {...rest}>
			{children}
		</MUIInput>
	);
};

export default Input;

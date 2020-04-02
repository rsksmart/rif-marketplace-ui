import React, { FC } from 'react';
import { InputAdornment as MUIInputAdornment, InputAdornmentProps as MUIInputAdornmentProps } from '@material-ui/core';

export interface InputAdornmentProps extends MUIInputAdornmentProps { };

const InputAdornment: FC<InputAdornmentProps> = ({ children, ...rest }) => {
	return (
		<MUIInputAdornment {...rest}>
			{children}
		</MUIInputAdornment>
	);
};

export default InputAdornment;

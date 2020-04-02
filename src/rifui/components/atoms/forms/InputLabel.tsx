import React, { FC } from 'react';
import { InputLabel as MUIInputLabel, InputLabelProps as MUIInputLabelProps } from '@material-ui/core';

export interface InputLabelProps extends MUIInputLabelProps { };

const InputLabel: FC<InputLabelProps> = ({ children, ...rest }) => {
	return (
		<MUIInputLabel {...rest}>
			{children}
		</MUIInputLabel>
	);
};

export default InputLabel;
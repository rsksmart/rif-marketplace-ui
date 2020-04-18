import React, { FC } from 'react';
import { Select as MUISelect, SelectProps as MUISelectProps } from '@material-ui/core';

export interface SelectProps extends MUISelectProps {
};

const Select: FC<SelectProps> = ({ ...rest }) => {
    return (
        <MUISelect {...rest} />
    );
};

export default Select;
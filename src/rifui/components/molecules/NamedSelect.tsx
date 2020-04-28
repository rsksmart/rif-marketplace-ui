import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { FC } from 'react';
import { FormControl, InputLabel, Select } from '@rsksmart/rif-ui';

export interface NamedSelectProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>, child: React.ReactNode) => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        namedSelect: {

        }
    }),
);

const NamedSelect: FC<NamedSelectProps> = ({ children, label, value, onChange }) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.namedSelect}>
            <InputLabel id="select-label">{label}</InputLabel>
            <Select
                labelId="select-label"
                id="select"
                value={value}
                onChange={onChange}
            // input={<BootstrapInput />}
            >
                {children}
            </Select>
        </FormControl>
    );
}

export default NamedSelect;
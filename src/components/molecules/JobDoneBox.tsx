import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import tickWide from 'rifui/assets/images/tickWide.svg';
import { colors } from 'rifui/theme';

export interface JobDoneBoxProps {
    text: string,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        body: {
            border: '1px solid #008FF7',
            borderRadius: 12,
            boxSizing: 'border-box',
            color: colors.primary,
            display: 'flex',
            flexDirection: 'column',
            height: 120,
            justifyContent: 'center',
            margin: '1em',
            textAlign: 'center',
            width: 222,
        }
    }),
);

const JobDoneBox: FC<JobDoneBoxProps> = ({ text }) => {
    const classes = useStyles();

    return (
        <div className={classes.body}>
            <img src={tickWide} alt='done' />
            <p>{text}</p>
        </div>
    );
}

export default JobDoneBox;
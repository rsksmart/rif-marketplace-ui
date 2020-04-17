import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import tickWide from 'rifui/assets/tickWide.svg';

export interface JobDoneBoxProps {
    text: string,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        body: {
            border: '1px solid #008FF7',
            boxSizing: 'border-box',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
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
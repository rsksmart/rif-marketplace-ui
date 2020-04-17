import { createStyles, makeStyles, Theme } from '@material-ui/core';
import doneImg from 'rifui/assets/done_img.svg';
import React, { FC } from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        body: {
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
            paddingTop: 50,
        },
    }),
);

const TxCompletePageTemplate: FC<{}> = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.body}>
            <img src={doneImg} alt='Job done!' />
            {children}
        </div>
    );
}

export default TxCompletePageTemplate;


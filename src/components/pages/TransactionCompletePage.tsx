import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import tickWide from 'rifui/assets/tickWide.svg';
import { Button } from 'rifui';


export interface TransactionCompletePageProps {
    location: any
}

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
        msgRect: {
            border: '1px solid #008FF7',
            boxSizing: 'border-box',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
        },
        actions: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
        }
    }),
);

const TransactionCompletePage: FC<TransactionCompletePageProps> = (props) => {
    const classes = useStyles();
    const { location: { state: { txType } } } = props;

    return (
        <div className={classes.body}>
            <img src={window.location.origin + '/assets/img/done_img.svg'} alt='Job done!' />
            <div className={classes.msgRect}>
                <img src={tickWide} alt='done' />
                <p>Your domain has been {txType === 'buy' ? 'bought' : 'listed'}.</p>
            </div>
            {/* <a href=''>Check it in the explorer</a> */}
            <div className={classes.actions}>
                <Button>View my domains</Button>
                {txType === 'buy' && <Button>Buy another domain</Button>}
                {txType === 'list' && <Button>View domain listing</Button>}
            </div>
        </div>
    );
}

export default TransactionCompletePage;


import React, { FC, useContext } from 'react'
import MarketStore from 'store/Market/MarketStore';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import CircularProgress from 'rifui/components/atoms/CircularProgress';

export interface TransactionInProgressPanelProps {
    className?: string
    text: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            width: 300,
            marginTop: 100,
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'center',
        }
    }),
);

const TransactionInProgressPanel: FC<TransactionInProgressPanelProps> = ({ className = '', text }) => {
    const classes = useStyles();

    const {
        state: {
            MarketState: {
                currentOrder
            }
        }
    } = useContext(MarketStore)


    return <div className={classes.content}>
        <p>{text}</p>
        <CircularProgress />
        <p>The waiting period is required to securely {!!currentOrder && currentOrder.txType} your domain. Please do not close this tab until the process has finished.</p>
    </div>
}

export default TransactionInProgressPanel;
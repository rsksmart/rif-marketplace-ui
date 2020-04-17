import React, { FC, useContext } from 'react'
import MarketStore from 'store/Market/MarketStore';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import CircularProgress from 'rifui/components/atoms/CircularProgress';

export interface TransactionInProgressPanelProps {
  text: string
  progMsg: string
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
      textAlign: 'center',
    }
  }),
);

const TransactionInProgressPanel: FC<TransactionInProgressPanelProps> = ({ progMsg, text }) => {
  const classes = useStyles();

  const {
    state: {
      currentOrder
    }
  } = useContext(MarketStore)


  return <div className={classes.content}>
    <p>{text}</p>
    <CircularProgress />
    <p>{progMsg}</p>
  </div>
}

export default TransactionInProgressPanel;
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { FC } from 'react';
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
  return <div className={classes.content}>
    <p>{text}</p>
    <CircularProgress />
    <p>{progMsg}</p>
  </div>
}

export default TransactionInProgressPanel;
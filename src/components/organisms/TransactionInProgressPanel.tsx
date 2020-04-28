import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { CircularProgress, Typography } from '@rsksmart/rif-ui';

export interface TransactionInProgressPanelProps {
  text: string
  progMsg: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      width: '100%',
      marginTop: theme.spacing(3),
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
    <Typography>{text}</Typography>
    <CircularProgress />
    <Typography>{progMsg}</Typography>
  </div>
}

export default TransactionInProgressPanel;
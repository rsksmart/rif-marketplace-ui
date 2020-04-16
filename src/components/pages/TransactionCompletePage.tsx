import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import tickWide from 'rifui/assets/images/tickWide.svg';
import doneImg from 'assets/images/done_img.svg'
import { Button } from 'rifui';
import { ROUTES } from 'routes';


export interface TransactionCompletePageProps {
  location: any,
  history: any,
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
  const { location: { state: { txType } }, history } = props;

  return (
    <div className={classes.body}>
      <img src={doneImg} alt='Job done!' />
      <div className={classes.msgRect}>
        <img src={tickWide} alt='done' />
        <p>Your domain has been {txType === 'buy' ? 'bought' : 'listed'}.</p>
      </div>
      <div className={classes.actions}>
        <Button onClick={() => { history.push(ROUTES.DOMAINS) }}>View my domains</Button>
        {txType === 'buy' && <Button onClick={() => { history.push(ROUTES.DOMAINS) }}>Buy another domain</Button>}
        {txType === 'list' && <Button onClick={() => { history.push(ROUTES.DOMAINS) }}>View domain listing</Button>}
      </div>
    </div>
  );
}

export default TransactionCompletePage;


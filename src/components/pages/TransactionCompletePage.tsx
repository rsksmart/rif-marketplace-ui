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
  const { history } = props;

  return (
    <div className={classes.body}>
      <img src={doneImg} alt='Job done!' />
      <div className={classes.msgRect}>
        <img src={tickWide} alt='done' />
        <p>Your domain has been bought.</p>
      </div>
      {/* <a href=''>Check it in the explorer</a> */}
      <div className={classes.actions}>
        <Button onClick={() => { alert('This should take you to the RNS admin page.') }}>Admin my domain</Button>
        <Button onClick={() => { history.push(ROUTES.DOMAINS.BUY) }}>Buy another domain</Button>
      </div>
    </div>
  );
}

export default TransactionCompletePage;


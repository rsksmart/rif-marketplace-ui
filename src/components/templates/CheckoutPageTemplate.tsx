import React, { FC, useContext } from 'react';
import ReturnButton, { ReturnButtonProps } from 'components/molecules/ReturnButton';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import MarketStore from 'store/Market/MarketStore';
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel';

export interface CheckoutPageTemplateProps {
  className?: string
  backButtonProps: ReturnButtonProps
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
    }
  }),
);

const CheckoutPageTemplate: FC<CheckoutPageTemplateProps> = ({ className = '', backButtonProps, children }) => {
  const classes = useStyles();

  const { state: { currentOrder } } = useContext(MarketStore)

  return (
    <div className={className}>
      {!currentOrder.isProcessing && <ReturnButton {...backButtonProps} />}
      <div className={classes.body}>
        {children}
      </div>
    </div>
  )
}

export default CheckoutPageTemplate;
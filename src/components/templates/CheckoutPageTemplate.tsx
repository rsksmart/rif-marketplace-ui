import React, { FC, useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import ReturnButton, { ReturnButtonProps } from 'components/molecules/ReturnButton';
import MarketStore from 'store/Market/MarketStore';
import { Grid } from 'rifui';

export interface CheckoutPageTemplateProps {
  className?: string
  backButtonProps: ReturnButtonProps
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      paddingTop: theme.spacing(2),
      width: '100%',
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    returnBtnContainer: {
      alignSelf: 'flex-start',
      display: 'flex',
      justifyContent: 'center',
      marginLeft: theme.spacing(2),
    }
  }),
);

const CheckoutPageTemplate: FC<CheckoutPageTemplateProps> = ({ className = '', backButtonProps, children }) => {
  const classes = useStyles();

  const { state: { currentOrder } } = useContext(MarketStore);

  return (
    <Grid container direction='row' className={`${classes.body} ${className}`}>
      <Grid item xs={12} md={3} className={classes.returnBtnContainer}>
        {!currentOrder.isProcessing && <ReturnButton {...backButtonProps} />}
      </Grid>
      <Grid className={classes.mainContent} item xs={12} md={6}>
        {children}
      </Grid>
      <Grid item md={3} />
    </Grid>
  )
}

export default CheckoutPageTemplate;
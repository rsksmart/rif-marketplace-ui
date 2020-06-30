import React, { FC, useContext, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import ReturnButton, { ReturnButtonProps } from 'components/molecules/ReturnButton'
import MarketStore from 'store/Market/MarketStore'
import { MARKET_ACTIONS } from 'store/Market/marketActions'

export interface CheckoutPageTemplateProps {
  className?: string
  backButtonProps: ReturnButtonProps
  isProcessing?: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  body: {
    paddingTop: theme.spacing(2),
    width: '100%',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  returnBtnContainer: {
    alignSelf: 'flex-start',
    display: 'flex',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
  },
}))

const CheckoutPageTemplate: FC<CheckoutPageTemplateProps> = ({
  className = '',
  backButtonProps,
  children,
  isProcessing
}) => {
  const classes = useStyles()

  // const { state: { currentOrder }, dispatch } = useContext(MarketStore)

  // .ito - add this clean up on the proper page
  // useEffect(() => () => {
  //   dispatch({ type: MARKET_ACTIONS.CLEAN_UP, payload: { currentListing: true, currentOrder: true } })
  // }, [dispatch])

  return (
    <Grid container direction="row" className={`${classes.body} ${className}`}>
      <Grid item xs={12} md={3} className={classes.returnBtnContainer}>
        {!isProcessing && <ReturnButton {...backButtonProps} />}
        {/* {!currentOrder.isProcessing && <ReturnButton {...backButtonProps} />} */}
      </Grid>
      <Grid className={classes.mainContent} item xs={12} md={6}>
        {children}
      </Grid>
      <Grid item md={3} />
    </Grid>
  )
}

export default CheckoutPageTemplate

import React, { FC, useContext, useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core'
import { doneThumbsUpImg } from '@rsksmart/rif-ui'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore from 'store/Market/MarketStore'

const useStyles = makeStyles(() => createStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    paddingTop: 50,
  },
}))

const TxCompletePageTemplate: FC<{}> = ({ children }) => {
  const classes = useStyles()

  const { dispatch } = useContext(MarketStore)

  // useEffect(() => () => {
  //   dispatch({ type: MARKET_ACTIONS.CLEAN_UP, payload: { currentOrder: true } })
  // }, [dispatch])

  return (
    <div className={classes.body}>
      <img src={doneThumbsUpImg} alt="Job done!" />
      {children}
    </div>
  )
}

export default TxCompletePageTemplate

import { createStyles, makeStyles } from '@material-ui/core'
import { doneThumbsUpImg } from '@rsksmart/rif-ui'
import React, { FC } from 'react'

const useStyles = makeStyles(() => createStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    paddingTop: 50,
    width: '100%'
  },
}))

const TxCompletePageTemplate: FC<{}> = ({ children }) => {
  const classes = useStyles()
  return (
    <div className={classes.body}>
      <img src={doneThumbsUpImg} alt="Job done!" />
      {children}
    </div>
  )
}

export default TxCompletePageTemplate

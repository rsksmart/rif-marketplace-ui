import { makeStyles } from '@material-ui/core/styles'
import React, { FC } from 'react'

const useStyles = makeStyles(() => ({
  root: {
    background: 'rgba(275, 275, 275, 0.8)',
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed',
    width: '100vw',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
}))

const OverlaidPageTemplate: FC = ({ children }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {children}
    </div>
  )
}

export default OverlaidPageTemplate

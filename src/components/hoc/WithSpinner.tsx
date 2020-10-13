import React from 'react'
import { makeStyles } from '@material-ui/core'
import logoBlueIcon from 'assets/images/logoBlueIcon.svg'
import './WithSpinner.css'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    zIndex: 2,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF55',
  },
  spinner: {
    display: 'inline-block',
    zIndex: 3,
    width: '50px',
    height: '50px',
    border: 'none',
    animation: 'spin 2s ease-in-out infinite',
    WebkitAnimation: 'spin 2s ease-in-out infinite',
  },
}))

const WithSpinner = (WrappedComponent: React.ElementType) => {
  const Spinner = ({ isLoading, ...props }) => {
    const classes = useStyles()

    return (
      <div className={classes.root}>
        {
          isLoading
          && (
            <div className={classes.overlay}>
              <img className={classes.spinner} src={logoBlueIcon} alt="logo" />
            </div>
          )
        }
        <WrappedComponent {...props} />
      </div>
    )
  }
  return Spinner
}

export default WithSpinner
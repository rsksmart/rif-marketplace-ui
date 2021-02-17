import React, { FC, useContext } from 'react'
import Collapse from '@material-ui/core/Collapse'
import Alert from '@material-ui/lab/Alert'
import AppContext from 'context/App'

const AlertPanel: FC = () => {
  const {
    state: {
      alertPanel: {
        display,
        message,
      },
    },
    dispatch,
  } = useContext(AppContext)

  const handleClose = (): void => {
    dispatch({
      type: 'HIDE_ALERT',
    })
  }

  return (
    <Collapse in={display}>
      <Alert severity="warning" onClose={handleClose}>
        {message}
      </Alert>
    </Collapse>
  )
}

export default AlertPanel

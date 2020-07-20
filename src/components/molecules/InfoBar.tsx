import {
  Button, ButtonProps, createStyles, makeStyles, Snackbar, Theme,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { Severity } from 'models/UIMessage'
import React, { FC } from 'react'

export interface InfoBarProps {
  isVisible: boolean
  text: string
  button: ButtonProps
  buttonText: string
  type: Severity
}

const useStyles = makeStyles((_: Theme) => createStyles({
  alert: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    padding: 0,
  },
}))

const InfoBar: FC<InfoBarProps> = ({
  isVisible, text, button, buttonText, type,
}) => {
  const classes = useStyles()

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isVisible}
    >
      <MuiAlert severity={type} className={classes.alert}>
        {text}
        <Button className={classes.button} color="primary" {...button}>{buttonText}</Button>
      </MuiAlert>
    </Snackbar>
  )
}

export default InfoBar

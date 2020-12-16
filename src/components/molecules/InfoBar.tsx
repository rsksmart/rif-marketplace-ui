import {
  Button, ButtonProps, createStyles, makeStyles, Snackbar, Typography,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { Severity } from 'models/UIMessage'
import React, { FC } from 'react'

export interface InfoBarProps {
  isVisible: boolean
  text: string
  button?: ButtonProps
  buttonText?: string
  type: Severity
}

const useStyles = makeStyles(() => createStyles({
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
  const showButton = Boolean(button) && Boolean(buttonText)

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isVisible}
    >
      <MuiAlert severity={type} className={classes.alert}>
        <Typography display="inline">{text}</Typography>
        {
          showButton && (
            <Button className={classes.button} color="primary" {...button}>{buttonText}</Button>
          )
        }
      </MuiAlert>
    </Snackbar>
  )
}

export default InfoBar

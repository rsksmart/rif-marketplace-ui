import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { makeStyles, Theme } from '@material-ui/core'

export interface CancelOfferDialogueProps {
  open: boolean
  onClose: () => void
  onConfirmCancel: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonNo: {
    marginRight: theme.spacing(2),
  },
}))

const CancelOfferDialogue: FC<CancelOfferDialogueProps> = ({ open, onClose, onConfirmCancel }) => {
  const classes = useStyles()
  const actions = (
    <Grid container justify="center">
      <Button className={classes.buttonNo} color="primary" rounded variant="outlined" onClick={onClose}>No</Button>
      <Button color="primary" rounded variant="contained" onClick={onConfirmCancel}>Yes</Button>
    </Grid>
  )
  return (
    <ModalDialogue
      open={open}
      onClose={onClose}
      title="Are you sure you want to cancel this offer?"
      footer={actions}
    >
      <Grid container justify="center">
        <Typography align="center" color="secondary">
          The offer will be cancelled inmediately but your active contracts will run until the expiration date.
        </Typography>
      </Grid>
    </ModalDialogue>
  )
}

export default CancelOfferDialogue

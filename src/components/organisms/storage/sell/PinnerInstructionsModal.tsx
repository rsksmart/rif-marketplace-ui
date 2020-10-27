import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { colors, ModalDialogue } from '@rsksmart/rif-ui'
import { makeStyles, Theme } from '@material-ui/core/styles'

export interface PinnerInstructionsModal {
  open: boolean
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  terminalInstructions: {
    padding: theme.spacing(2),
    border: `1px solid ${colors.gray3}`,
    margin: theme.spacing(2, 0),
  },
}))

const PinnerInstructionsModal: FC<PinnerInstructionsModal> = ({ open, onClose }) => {
  const classes = useStyles()
  return (
    <ModalDialogue title="Install and initialize the pinning service" open={open} onClose={onClose}>
      <Grid container justify="center">
        <Typography align="center" color="secondary">To get your Peer ID, please first run the following commands in your terminal:</Typography>
        <Grid
          container
          className={classes.terminalInstructions}
        >
          <Grid item xs={12}>
            <Typography align="center" color="secondary">$ npm install -g @rsksmart/rif-storage-pinning</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" component="div" color="secondary">
              {'$ rif-pinner init --offerId <'}
              <Box
                display="inline"
                style={{ color: colors.primary }}
              >
                add here your account address
              </Box>
              {'>'}
            </Typography>
          </Grid>
        </Grid>
        <Typography gutterBottom component="div" color="secondary" align="center">
          {'Your '}
          <Box display="inline" fontWeight="fontWeightMedium">Peer ID</Box>
          {' '}
          will be generated in your terminal with the following format:
          {' '}
        </Typography>
        <Typography align="center" gutterBottom component="div" color="secondary">
          <Box display="inline" fontWeight="fontWeightMedium">QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N</Box>
        </Typography>
        <Typography align="center" gutterBottom color="secondary">Please, copy it from the terminal and paste it in the Peer ID field of the form.</Typography>
      </Grid>
    </ModalDialogue>
  )
}

export default PinnerInstructionsModal

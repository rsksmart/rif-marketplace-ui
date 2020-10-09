import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { zeroAddress } from 'context/Services/storage/interfaces'
import { Box, Grid, Divider } from '@material-ui/core'

export interface DepositModalProps {
  currentBalance: string
  open: boolean
  onClose: () => void
  onDeposit: (amount: number, token: string) => void
}

const DepositModal: FC<DepositModalProps> = ({
  currentBalance, open, onClose, onDeposit,
}) => {
  // TODO: provide input for deposit
  const amount = 100
  const token = zeroAddress

  const handleDeposit = () => onDeposit(amount, token)
  const actions: JSX.Element = (
    <Button
      color="primary"
      rounded
      variant="contained"
      onClick={handleDeposit}
    >
      Stake Funds
    </Button>
  )
  return (
    <ModalDialogue
      open={open}
      onClose={onClose}
      title="Stacking"
      footer={actions}
    >
      <Grid container direction="column">
        <Typography align="center" color="secondary">
          The amount of RIF staked in RIF Marketplace helps to enhance your
          reputation and position your offers at the top when selling storage.
        </Typography>
        <Divider />
        <Typography component="div" color="secondary" align="center">
          {'Your current balance is '}
          <Box display="inline" fontWeight="fontWeightRegular">
            {currentBalance}
          </Box>
        </Typography>
      </Grid>
    </ModalDialogue>
  )
}

export default DepositModal

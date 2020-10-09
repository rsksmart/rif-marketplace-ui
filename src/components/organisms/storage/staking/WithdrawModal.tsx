import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { zeroAddress } from 'context/Services/storage/interfaces'
import { Divider } from '@material-ui/core'

export interface WithdrawModalProps {
  open: boolean
  onClose: () => void
  onWithdraw: (amount: number, token: string) => void
  canWithdraw: boolean
  currentBalance: number
}

const WithdrawModal: FC<WithdrawModalProps> = ({
  open, onClose, onWithdraw, canWithdraw, currentBalance,
}) => {
  const amount = 100
  const token = zeroAddress

  const handleWithdraw = () => onWithdraw(amount, token)

  const actions: JSX.Element = (
    <Button
      disabled={!canWithdraw || amount > currentBalance}
      color="primary"
      rounded
      variant="contained"
      onClick={handleWithdraw}
    >
      Withdraw funds
    </Button>
  )

  // TODO: style modal and add input field with validation,
  // the amount to withdraw should be smaller than the current balance and greater than 0
  return (
    <ModalDialogue
      open={open}
      onClose={onClose}
      title="Withdraw stake"
      footer={actions}
    >
      <Grid container justify="center" direction="column">
        <Typography align="center" color="secondary">
          Withdrawing RIF staked in the Marketplace downgrade your reputation
          and your offers will not be positioned at the top when selling storage.
        </Typography>
        <Divider color="secondary" style={{ margin: '10px 0' }} />
        <Typography
          component="div"
          hidden={canWithdraw}
          align="center"
          color="secondary"
        >
          <Box fontWeight="fontWeightMedium">
            You cannot withdraw funds because all your contracts are running.
            Please wait until your contract finish
          </Box>
        </Typography>
      </Grid>
    </ModalDialogue>
  )
}

export default WithdrawModal

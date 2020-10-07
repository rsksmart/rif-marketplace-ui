import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { ZERO_ADDRESS } from '../../../../contracts/Staking'

export interface CancelOfferDialogueProps {
    open: boolean
    onClose: () => void
    onWithdraw: (amount: number, token: string) => void
    canWithdraw: boolean
}

const StakingWithdrawDialogue: FC<CancelOfferDialogueProps> = ({
  open, onClose, onWithdraw, canWithdraw,
}) => {
  const amount = 100
  const token = ZERO_ADDRESS

  const actions = (
    <Grid justify="flex-end">
      <Button disabled={!canWithdraw} color="primary" rounded variant="contained" onClick={() => onWithdraw(amount, token)}>Withdraw funds</Button>
    </Grid>
  )
  return (
    <ModalDialogue
      open={open}
      onClose={onClose}
      title="Withdraw stake"
      footer={actions}
    >
      <Grid justify="center">
        <Typography align="center" color="secondary">
          Withdrawing RIF staked in the Marketplace downgrade your reputation
          and your offers will not be positioned at the top when selling storage.
        </Typography>
        <Typography hidden={canWithdraw} align="center" color="secondary">
          You cannot withdraw funds because all your contracts are running.
          Please wait until your contract finish
        </Typography>
      </Grid>
    </ModalDialogue>
  )
}

export default StakingWithdrawDialogue

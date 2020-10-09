import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { zeroAddress } from 'context/Services/storage/interfaces'

export interface DepositModalProps {
  open: boolean
  onClose: () => void
  onDeposit: (amount: number, token: string) => void
}

const DepositModal: FC<DepositModalProps> = ({ open, onClose, onDeposit }) => {
  // TODO: provide input for deposit
  const amount = 100
  const token = zeroAddress
  const actions: JSX.Element = (
    <Button
      color="primary"
      rounded
      variant="contained"
      onClick={() => onDeposit(amount, token)}
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
      <Typography align="center" color="secondary">
        The amount of RIF staked in RIF Marketplace helps to enhance your
        reputation and position your offers at the top when selling storage.
      </Typography>
    </ModalDialogue>
  )
}

export default DepositModal

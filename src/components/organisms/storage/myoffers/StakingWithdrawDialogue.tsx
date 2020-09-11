import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { ZERO_ADDRESS } from '../../../../contracts/Staking'

export interface CancelOfferDialogueProps {
    open: boolean
    onClose: () => void
    onWithdraw: (amount: number, token: string) => void,
}

const StakingWithdrawDialogue: FC<CancelOfferDialogueProps> = ({ open, onClose, onWithdraw }) => {
    const amount = 100
    const token = ZERO_ADDRESS

    // TODO retrieve utilize capacity for all offers related to that account to allow withdraw
    const canWithdraw = true

    const actions = (
        <Grid justify="flex-end">
        <Button color="primary" rounded variant="contained" onClick={() => onWithdraw(amount, token)}>Withdraw funds</Button>
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
            </Grid>
        </ModalDialogue>
)
}

export default StakingWithdrawDialogue

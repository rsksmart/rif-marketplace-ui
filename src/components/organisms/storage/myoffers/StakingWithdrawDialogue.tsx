import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { ZERO_ADDRESS } from '../../../../contracts/Staking'

export interface CancelOfferDialogueProps {
    open: boolean
    onClose: () => void
    onWithdraw: (amount: number, token: string) => void
}

const StakingWithdrawDialogue: FC<CancelOfferDialogueProps> = ({ open, onClose, onWithdraw }) => {
    const amount = 10
    const token = ZERO_ADDRESS
    const actions = (
        <Grid justify="flex-end">
        <Button style={{ marginRight: 8 }} color="primary" rounded variant="outlined" onClick={onClose}>Close</Button>
        <Button color="primary" rounded variant="contained" onClick={() => onWithdraw(amount, token)}>Withdraw</Button>
        </Grid>
)
    return (
        <ModalDialogue
            open={open}
    onClose={onClose}
    title="Withdraw"
    footer={actions}
    >
    <Grid justify="center">
    <Typography align="center" color="secondary">
        Withdraw
    </Typography>
    </Grid>
    </ModalDialogue>
)
}

export default StakingWithdrawDialogue

import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { ZERO_ADDRESS } from '../../../../contracts/Staking'

export interface CancelOfferDialogueProps {
    open: boolean
    onClose: () => void
    onDeposit: (amount: number, token: string) => void
}

const StakingStakeDialogue: FC<CancelOfferDialogueProps> = ({ open, onClose, onDeposit }) => {
    const amount = 100
    const token = ZERO_ADDRESS
    const actions = (
        <Grid justify="flex-end">
            <Button color="primary" rounded variant="contained" onClick={() => onDeposit(amount, token)}>Stake Funds</Button>
        </Grid>
    )
    return (
        <ModalDialogue
            open={open}
            onClose={onClose}
            title="Stacking"
            footer={actions}
        >
            <Grid justify="center">
                <Typography align="center" color="secondary">
                    The amount of RIF staked in RIF Marketplace helps to enhance your
                    reputation and position your offers at the top when selling storage.
                </Typography>
            </Grid>
        </ModalDialogue>
    )
}

export default StakingStakeDialogue

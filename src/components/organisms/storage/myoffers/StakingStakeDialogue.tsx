import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'

export interface CancelOfferDialogueProps {
    open: boolean
    onClose: () => void
    onDeposit: (amount: number, token: string) => void
}

const StakingStakeDialogue: FC<CancelOfferDialogueProps> = ({ open, onClose, onDeposit }) => {
    const actions = (
        <Grid justify="flex-end">
        <Button style={{ marginRight: 8 }} color="primary" rounded variant="outlined" onClick={onClose}>No</Button>
        <Button color="primary" rounded variant="contained">Yes</Button>
        </Grid>
)
    return (
        <ModalDialogue
            open={open}
    onClose={onClose}
    title="Are you sure you want to cancel this offer?"
    footer={actions}
    >
    <Grid justify="center">
    <Typography align="center" color="secondary">
        The offer will be cancelled inmediately but your active contracts will run until the expiration date.
    </Typography>
    </Grid>
    </ModalDialogue>
)
}

export default StakingStakeDialogue

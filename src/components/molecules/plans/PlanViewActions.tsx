import Grid, { GridProps } from '@material-ui/core/Grid'
import { Button } from '@rsksmart/rif-ui'
import { ButtonProps } from '@material-ui/core/Button' // FIXME: this is meant to come from RUI, but @rsksmart/rif-ui/dist/components/atoms/Button module cannot be found. FIX RUI!
// import Button, { ButtonProps } from '@rsksmart/rif-ui/dist/components/atoms/Button'
import React, {
  FC,
} from 'react'

type Props = GridProps & {
    editProps: ButtonProps
    cancelProps: ButtonProps
}

const PlanViewActions: FC<Props> = ({ editProps, cancelProps, ...props }) => (
  <Grid
    container
    justify="flex-end"
    spacing={1}
    {...props}
  >
    <Grid item>
      <Button
        variant="outlined"
        color="primary"
        rounded
        {...editProps}
        // onClick={onEditOffer}
        // disabled={!storageOffer.isActive}
      >
        Edit plan
      </Button>
    </Grid>
    <Grid item>
      <Button
        variant="outlined"
        rounded
        color="primary"
        {...cancelProps}
        // onClick={handleCancelOpen}
        // disabled={!storageOffer.isActive}
      >
        Cancel plan
      </Button>
    </Grid>
    {/* <CancelOfferDialogue
        open={cancelOfferOpen}
        onClose={handleCancelClose}
        onConfirmCancel={handleCancelation}
    /> */}
  </Grid>
)

export default PlanViewActions

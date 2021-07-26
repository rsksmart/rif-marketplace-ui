import Grid, { GridProps } from '@material-ui/core/Grid'
import { Button } from '@rsksmart/rif-ui'
import { ButtonProps } from '@material-ui/core/Button' // FIXME: this is meant to come from RUI, but @rsksmart/rif-ui/dist/components/atoms/Button module cannot be found. FIX RUI!
// import Button, { ButtonProps } from '@rsksmart/rif-ui/dist/components/atoms/Button'
import React, {
  FC,
} from 'react'
import FeatureNotSupportedButton from 'components/atoms/FeatureNotSupportedButton'

type UnsupportedButtonProps = ButtonProps & {
  isUnsupportedButton: boolean
}

type Props = GridProps & {
    editProps: UnsupportedButtonProps
    cancelProps: UnsupportedButtonProps
}

const PlanViewActions: FC<Props> = ({ editProps, cancelProps, ...props }) => (
  <Grid
    container
    justify="flex-end"
    spacing={1}
    {...props}
  >
    <Grid item>
      {editProps.isUnsupportedButton ? <FeatureNotSupportedButton message="edit plan not supported">Edit Plan</FeatureNotSupportedButton>
        : (
          <Button
            variant="outlined"
            color="primary"
            rounded
            {...editProps}
          >
            Edit plan
          </Button>
        )}
    </Grid>
    <Grid item>
      {cancelProps.isUnsupportedButton ? <FeatureNotSupportedButton message="cancel plan not supported">Cancel Plan</FeatureNotSupportedButton>
        : (
          <Button
            variant="outlined"
            rounded
            color="primary"
            {...cancelProps}
          >
            Cancel plan
          </Button>
        )}
    </Grid>
  </Grid>
)

export default PlanViewActions

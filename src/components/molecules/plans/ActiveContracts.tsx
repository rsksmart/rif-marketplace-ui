import {
  Grid, Typography,
} from '@material-ui/core'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Divider from '@material-ui/core/Divider'
import PlanViewActions from 'components/molecules/plans/PlanViewActions'
import React, {
  FC,
} from 'react'

type Props = {
  handlePlanEdit: () => void
  isPlanEditDisabled: boolean
  handlePlanCancel: () => void
  isPlanCancelDisabled: boolean
}

const ActiveContracts: FC<Props> = ({
  handlePlanEdit,
  isPlanEditDisabled,
  handlePlanCancel,
  isPlanCancelDisabled,
  children,
}) => (
  <AccordionDetails>
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <PlanViewActions
          editProps={{
            onClick: handlePlanEdit,
            disabled: isPlanEditDisabled,
          }}
          cancelProps={{
            onClick: handlePlanCancel,
            disabled: isPlanCancelDisabled,
          }}
        />
      </Grid>
      <Grid item><Divider /></Grid>
      <Grid item>
        <Typography color="primary" variant="subtitle1" style={{ paddingLeft: '16px' }}>
          Active contracts
        </Typography>
      </Grid>
      <Grid container item>
        {children}
      </Grid>
    </Grid>
  </AccordionDetails>
)

export default ActiveContracts

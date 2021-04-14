import {
  Grid,
} from '@material-ui/core'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Divider from '@material-ui/core/Divider'
import TableContainer from '@material-ui/core/TableContainer'
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
      <Grid container item>
        {/* <TableContainer> */}
        {children}
        {/* </TableContainer> */}
      </Grid>
    </Grid>
  </AccordionDetails>
)

export default ActiveContracts

import Grid, { GridProps } from '@material-ui/core/Grid'
import React, {
  FC,
} from 'react'

type Props = GridProps & {
    editButton: React.ReactElement
    cancelButton: React.ReactElement
}

const PlanViewActions: FC<Props> = ({
  editButton, cancelButton, ...props
}) => (
  <Grid
    container
    justify="flex-end"
    spacing={1}
    {...props}
  >
    <Grid item>
      {editButton}
    </Grid>
    <Grid item>
      {cancelButton}
    </Grid>
  </Grid>
)

export default PlanViewActions

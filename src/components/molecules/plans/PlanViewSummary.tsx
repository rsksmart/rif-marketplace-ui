import {
  Grid, Typography,
} from '@material-ui/core'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AccordionShowButton from 'components/molecules/AccordionShowButton'
import React, {
  FC,
} from 'react'

const PlanViewSummary: FC<{
  name: string
  left?: JSX.Element
  middle?: JSX.Element
  right?: JSX.Element
  }> = ({
    name, left, middle, right,
  }) => (
    <AccordionSummary
      expandIcon={<ExpandMoreIcon color="primary" />}
      aria-controls={`plan-${name}-content`}
    >
      <Grid container alignItems="center">
        <Grid item sm={1}>
          <Typography align="center" color="primary" variant="subtitle1">
            {name}
          </Typography>
        </Grid>
        <Grid item sm={3}>
          {left}
        </Grid>
        <Grid item sm={3}>
          {middle}
        </Grid>
        <Grid item sm={3}>
          {right}
        </Grid>
        <Grid item sm={2}>
          <AccordionShowButton show subject="active contracts" />
        </Grid>
      </Grid>
    </AccordionSummary>
  )

export default PlanViewSummary

import AccordionSummary from '@material-ui/core/AccordionSummary'
import Grid, { GridSize } from '@material-ui/core/Grid'

import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AccordionShowButton from 'components/molecules/AccordionShowButton'
import React, {
  FC,
} from 'react'

type Props = {
  name: string
  info?: JSX.Element[]
}

const NAME_GRID_CNT = 1
const SHOW_GRID_CNT = 2
const INFO_GRID_CNT = 12 - NAME_GRID_CNT - SHOW_GRID_CNT

const PlanViewSummary: FC<Props> = ({
  name, info = [],
}) => (
  <AccordionSummary
    expandIcon={<ExpandMoreIcon color="primary" />}
    aria-controls={`plan-${name}-content`}
  >
    <Grid container alignItems="center">
      <Grid item sm={NAME_GRID_CNT}>
        <Typography align="center" color="primary" variant="subtitle1">
          {name}
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={INFO_GRID_CNT as GridSize}
      >
        {info.map((item) => (
          <Grid item sm={(INFO_GRID_CNT / info.length) as GridSize}>
            {item}
          </Grid>
        )) }
      </Grid>
      <Grid item sm={SHOW_GRID_CNT as GridSize}>
        <AccordionShowButton show subject="active contracts" />
      </Grid>
    </Grid>
  </AccordionSummary>
)

export default PlanViewSummary

export type PlanViewSummaryProps = Props

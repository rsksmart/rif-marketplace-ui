import React, { FC, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button, colors } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'
import LabelWithValue from 'components/atoms/LabelWithValue'
import ActiveContracts from './ActiveContracts'

export interface ExpandableOfferProps {
  offerName: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    border: `1px solid ${colors.gray3}`,
    borderRadius: 15,
    boxShadow: 'none',
  },
  activeContracts: {
    marginTop: theme.spacing(3),
  },
  offerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

const ExpandableOffer: FC<ExpandableOfferProps> = ({ offerName }) => {
  const classes = useStyles()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleChange = () => setIsExpanded(!isExpanded)
  return (
    <Accordion
      className={classes.root}
      expanded={isExpanded}
      onChange={handleChange}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon color={isExpanded ? 'secondary' : 'primary'} />}
        aria-controls={`offer-${offerName}-content`}
      >
        {/* TODO: consider extracting to new molecule "MyOfferSummary" */}
        <Grid container alignItems="center">
          <Grid item sm={1}>
            <Typography align="center" color="primary" variant="subtitle1">{offerName}</Typography>
          </Grid>
          <Grid item sm={3}>
            <LabelWithValue label="Date" value="20.08.2020" />
          </Grid>
          <Grid
            item
            sm={3}
          >
            <LabelWithValue label="System" value="IPFS" />
          </Grid>
          <Grid item sm={3}>
            <LabelWithValue label="Listed Size" value="392 GB" />
          </Grid>
          <Grid item sm={2}>
            <Typography align="right" color={isExpanded ? 'secondary' : 'primary'}>View active contracts</Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column">
          <Grid container style={{ marginBottom: 12 }}>
            <Grid item sm={1} />
            <Grid item sm={3}>
              <LabelWithValue label="Remaining size" value="50 GB" />
            </Grid>
            <Grid
              item
              sm={8}
              className={classes.offerActions}
            >
              <Button
                style={{ marginRight: 4 }}
                variant="outlined"
                rounded
                color="primary"
              >
                Edit offer
              </Button>
              <Button variant="outlined" rounded color="primary">Cancel offer</Button>
            </Grid>
          </Grid>
          <Divider />
          <ActiveContracts className={classes.activeContracts} />
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default ExpandableOffer

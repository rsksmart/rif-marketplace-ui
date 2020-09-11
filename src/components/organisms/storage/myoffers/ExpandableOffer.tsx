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
import Logger from 'utils/Logger'
import { StorageOffer } from 'models/marketItems/StorageItem'
import ActiveContracts from './ActiveContracts'
import CancelOfferDialogue from './CancelOfferDialogue'

export interface ExpandableOfferProps {
  className?: string
  offerName: string
  storageOffer: StorageOffer
  initiallyExpanded?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    border: `1px solid ${colors.gray3}`,
    borderRadius: 15,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&:last-child': {
      borderRadius: 15,
    },
    '&:first-child': {
      borderRadius: 15,
    },
  },
  activeContracts: {
    marginTop: theme.spacing(3),
  },
  editOffer: {
    marginRight: theme.spacing(1),
  },
  detailsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
}))

const logger = Logger.getInstance()

const ExpandableOffer: FC<ExpandableOfferProps> = ({
  className = '', offerName, storageOffer, initiallyExpanded = false,
}) => {
  const classes = useStyles()
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)
  const [cancelOfferOpen, setCancelOfferOpen] = useState(false)
  const handleChange = () => setIsExpanded(!isExpanded)
  const handleCancelOpen = () => setCancelOfferOpen(true)
  const handleCancelClose = () => setCancelOfferOpen(false)
  // TODO: handle cancellation
  const handleCancelation = () => logger.info('todo: handle offers cancellation')
  // TODO: handle edit
  const handleEditOffer = () => logger.info('todo: handle edit offer')

  const { system, availableSizeGB } = storageOffer
  // TODO: once we get the agreements, calculate the remaining size
  const remainingSize = availableSizeGB
  return (
    <Accordion
      className={`${classes.root} ${className}`}
      expanded={isExpanded}
      onChange={handleChange}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon color="primary" />}
        aria-controls={`offer-${offerName}-content`}
      >
        <Grid container alignItems="center">
          <Grid item sm={1}>
            <Typography align="center" color="primary" variant="subtitle1">{offerName}</Typography>
          </Grid>
          <Grid item sm={3}>
            <LabelWithValue label="Remaining size" value={`${remainingSize} GB`} />
          </Grid>
          <Grid item sm={3}>
            <LabelWithValue label="System" value={system} />
          </Grid>
          <Grid item sm={3}>
            <LabelWithValue label="Listed Size" value={`${availableSizeGB} GB`} />
          </Grid>
          <Grid item sm={2}>
            <Typography align="right" color="primary">
              {isExpanded ? 'Hide ' : 'View '}
              {' '}
              active contracts
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column">
          <Grid container className={classes.detailsHeaderContainer}>
            <Button
              className={classes.editOffer}
              variant="outlined"
              color="primary"
              rounded
              onClick={handleEditOffer}
            >
              Edit offer
            </Button>
            <Button variant="outlined" rounded color="primary" onClick={handleCancelOpen}>Cancel offer</Button>
            <CancelOfferDialogue open={cancelOfferOpen} onClose={handleCancelClose} onConfirmCancel={handleCancelation} />
          </Grid>
          <Divider />
          <ActiveContracts className={classes.activeContracts} />
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default ExpandableOffer

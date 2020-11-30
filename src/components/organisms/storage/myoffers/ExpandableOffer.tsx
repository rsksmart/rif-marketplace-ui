import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button, colors, Web3Store } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'
import LabelWithValue from 'components/atoms/LabelWithValue'
import { StorageOffer } from 'models/marketItems/StorageItem'
import AgreementsContext, {
  AgreementContextProps,
} from 'context/Services/storage/agreements'
import CancelOfferDialogue from './CancelOfferDialogue'
import ActiveContracts from './ActiveContracts'

export interface ExpandableOfferProps {
  className?: string
  offerName: string
  storageOffer: StorageOffer
  initiallyExpanded?: boolean
  onCancelOffer: () => void
  onEditOffer: () => void
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
  activeContractsContainer: {
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

const ExpandableOffer: FC<ExpandableOfferProps> = ({
  className = '', offerName, storageOffer, initiallyExpanded = false, onCancelOffer, onEditOffer,
}) => {
  const classes = useStyles()
  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: {
      agreements,
    },
    dispatch: agreementsDispatch,
  } = useContext<AgreementContextProps>(AgreementsContext)

  // filter by the current account
  useEffect(() => {
    if (account) {
      agreementsDispatch({
        type: 'SET_FILTERS',
        payload: { provider: account },
      })
    }
  }, [account, agreementsDispatch])

  const { system, availableSizeGB, totalCapacityGB } = storageOffer
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)
  const [cancelOfferOpen, setCancelOfferOpen] = useState(false)
  const handleChange = (): void => setIsExpanded(!isExpanded)
  const handleCancelOpen = (): void => setCancelOfferOpen(true)
  const handleCancelClose = (): void => setCancelOfferOpen(false)

  const handleCancelation = (): void => {
    setCancelOfferOpen(false)
    onCancelOffer()
  }

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
            <LabelWithValue label="Remaining size" value={`${availableSizeGB} GB`} />
          </Grid>
          <Grid item sm={3}>
            <LabelWithValue label="System" value={system} />
          </Grid>
          <Grid item sm={3}>
            <LabelWithValue label="Listed Size" value={`${totalCapacityGB} GB`} />
          </Grid>
          <Grid item sm={2}>
            <Typography align="right" color="primary" variant="body2">
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
              onClick={onEditOffer}
              disabled={!storageOffer.isActive}
            >
              Edit offer
            </Button>
            <Button
              variant="outlined"
              rounded
              color="primary"
              onClick={handleCancelOpen}
              disabled={!storageOffer.isActive}
            >
              Cancel offer
            </Button>
            <CancelOfferDialogue
              open={cancelOfferOpen}
              onClose={handleCancelClose}
              onConfirmCancel={handleCancelation}
            />
          </Grid>
          <Divider />
          <Grid container className={classes.activeContractsContainer}>
            <ActiveContracts agreements={agreements} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default ExpandableOffer

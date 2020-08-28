import React, { FC, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button, colors } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  stakingRoot: {
    border: `1px solid ${colors.primary}`,
    borderRadius: 15,
    maxWidth: theme.spacing(100),
  },
}))

const ActiveContracts = () => (
  <TableContainer>
    <Table
      aria-labelledby="table of active contracts"
      size="small"
      aria-label="enhanced table"
    >
      <TableHead>
        <TableRow>
          <TableCell>Customer</TableCell>
          <TableCell>Content Size</TableCell>
          <TableCell>Renewal Date</TableCell>
          <TableCell>Subscription Type</TableCell>
          <TableCell>Monthly Fee</TableCell>
          <TableCell>Available Funds</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography component="div"><Box color={colors.gray5}>juan.rsk</Box></Typography>
          </TableCell>
          <TableCell>
            <Typography color="primary">74 GB</Typography>
          </TableCell>
          <TableCell>24 May 2021</TableCell>
          <TableCell>Monthly</TableCell>
          <TableCell>
            <Typography color="primary">3245 RIF</Typography>
          </TableCell>
          <TableCell>
            <Typography color="primary">3245 RIF</Typography>
          </TableCell>
          <TableCell style={{ display: 'flex' }}>
            <Button style={{ marginRight: 4 }} color="primary" rounded variant="outlined">Withdraw</Button>
            <Button color="primary" rounded variant="outlined">View</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography component="div"><Box color={colors.gray5}>juan.rsk</Box></Typography>
          </TableCell>
          <TableCell>
            <Typography color="primary">74 GB</Typography>
          </TableCell>
          <TableCell>24 May 2021</TableCell>
          <TableCell>Monthly</TableCell>
          <TableCell>
            <Typography color="primary">3245 RIF</Typography>
          </TableCell>
          <TableCell>
            <Typography color="primary">3245 RIF</Typography>
          </TableCell>
          <TableCell style={{ display: 'flex' }}>
            <Button style={{ marginRight: 4 }} color="primary" rounded variant="outlined">Withdraw</Button>
            <Button color="primary" rounded variant="outlined">View</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography component="div"><Box color={colors.gray5}>juan.rsk</Box></Typography>
          </TableCell>
          <TableCell>
            <Typography color="primary">74 GB</Typography>
          </TableCell>
          <TableCell>24 May 2021</TableCell>
          <TableCell>Monthly</TableCell>
          <TableCell>
            <Typography color="primary">3245 RIF</Typography>
          </TableCell>
          <TableCell>
            <Typography color="primary">3245 RIF</Typography>
          </TableCell>
          <TableCell style={{ display: 'flex' }}>
            <Button style={{ marginRight: 4 }} color="primary" rounded variant="outlined">Withdraw</Button>
            <Button color="primary" rounded variant="outlined">View</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography component="div"><Box color={colors.gray5}>juan.rsk</Box></Typography>
          </TableCell>
          <TableCell>
            <Typography color="primary">74 GB</Typography>
          </TableCell>
          <TableCell>24 May 2021</TableCell>
          <TableCell>Monthly</TableCell>
          <TableCell>
            <Typography color="primary">3245 RIF</Typography>
          </TableCell>
          <TableCell>
            <Typography color="primary">3245 RIF</Typography>
          </TableCell>
          <TableCell style={{ display: 'flex' }}>
            <Button style={{ marginRight: 4 }} color="primary" rounded variant="outlined">Withdraw</Button>
            <Button color="primary" rounded variant="outlined">View</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
)

const ExpandableOffer = ({ offerName }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleChange = () => setIsExpanded(!isExpanded)
  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleChange}
      style={{
        width: '100%',
        border: `1px solid ${colors.gray3}`,
        borderRadius: 15,
        boxShadow: 'none',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon color={isExpanded ? 'secondary' : 'primary'} />}
        aria-controls={`offer-${offerName.trim()}-content`}
      >
        <Grid container alignItems="center">
          <Grid item sm={1}>
            <Typography align="center" color="primary" variant="subtitle1">{offerName}</Typography>
          </Grid>
          <Grid item sm={3}>
            <Typography component="div" align="center" color="secondary">
              <Hidden smDown>
                <Box display="inline" style={{ color: colors.gray5 }}>Date </Box>
              </Hidden>
              20.08.2020
            </Typography>
          </Grid>
          <Grid
            item
            sm={3}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography component="div" align="center" color="secondary">
              <Hidden smDown>
                <Box display="inline" style={{ color: colors.gray5 }}>System </Box>
              </Hidden>
              IPFS
            </Typography>
          </Grid>
          <Grid item sm={3}>
            <Typography component="div" align="center" color="secondary">
              <Hidden smDown>
                <Box display="inline" style={{ color: colors.gray5 }}>Listed Size </Box>
              </Hidden>
              392GB
            </Typography>
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
              <Typography component="div" align="center" color="secondary">
                <Hidden smDown>
                  <Box display="inline" style={{ color: colors.gray5 }}>Remaining size </Box>
                </Hidden>
                50GB
              </Typography>
            </Grid>
            <Grid
              item
              sm={8}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
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
          <Grid container style={{ marginTop: 12 }}>
            <Typography gutterBottom color="primary" variant="subtitle1">Active contracts</Typography>
            <ActiveContracts />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

const StorageMyOffersPage: FC = () => {
  const classes = useStyles()
  return (
    // TODO: move the page wrapper to a template put higher maxWidth on mobile
    <Grid container justify="center">
      <div style={{ maxWidth: '80%' }}>
        {/* STAKING CARD - TODO: move to classes and create new organism/molecule */}
        <Grid className={classes.stakingRoot} container>
          <Grid
            container
            style={{ padding: 15 }}
            alignItems="center"
          >
            <Grid item xs={4} md={3}>
              <Typography color="primary" align="center">
                Staking
              </Typography>
            </Grid>
            <Grid item xs={8} md={9}>
              <Typography component="div" color="secondary">
                The amount of RIF staked in the marketplace helps to
                {' '}
                <Box display="inline" fontWeight="fontWeightMedium">enhance your reputation</Box>
                {' '}
                and
                {' '}
                <Box display="inline" fontWeight="fontWeightMedium">position your offers</Box>
                {' '}
                at the top when selling storage.
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            style={{
              padding: 15,
              borderTop: `1px solid ${colors.primary}`,
            }}
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography align="center">BALANCE</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary">2048 RIF</Typography>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button style={{ marginRight: 4 }} variant="outlined" rounded color="primary">Add funds</Button>
              <Button variant="outlined" rounded color="primary">Withdraw funds</Button>
            </Grid>
          </Grid>
        </Grid>
        {/* END - STAKING CARD */}
        {/* TITLE with Icon */}
        <Grid
          container
          alignItems="center"
          style={{ marginTop: 12 }}
        >
          <Grid item xs="auto">
            <img src={handProvidingFunds} alt="hand providing funds" />
          </Grid>
          <Grid item xs={10} md="auto">
            <Typography gutterBottom variant="h5" color="primary">
              You are providing the following storage space to your customers
            </Typography>
          </Grid>
        </Grid>
        {/* OFFERS */}
        <Grid container>
          <ExpandableOffer offerName="Offer 1" />
          <ExpandableOffer offerName="Offer 2" />
        </Grid>
      </div>
    </Grid>
  )
}

export default StorageMyOffersPage

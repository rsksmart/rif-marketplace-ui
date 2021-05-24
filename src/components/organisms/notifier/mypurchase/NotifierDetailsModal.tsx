import React, { FC } from 'react'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { theme } from '@rsksmart/rif-ui'
import RoundBtn from 'components/atoms/RoundBtn'
import { logNotImplemented } from 'utils/utils'
import withStyles from '@material-ui/core/styles/withStyles'
import Dialog from '@material-ui/core/Dialog'
import Marketplace from 'components/templates/marketplace/Marketplace'
import TableContainer from '@material-ui/core/TableContainer'
import MarketplaceCell from 'components/atoms/MarketplaceCell'
import { Item } from 'models/Market'
import CrossBtn from 'components/atoms/CrossBtn'

const StyledDialog = withStyles({
  root: {
    '& > .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
  paper: {
    padding: theme.spacing(2),
    borderRadius: 20,
    minWidth: '549px',
    minHeight: '529px',
  },
})(Dialog)

const subscriptionHeaders = {
  id: 'Subscription ID',
  provider: 'Provider',
  amount: 'Notifications',
  channels: 'Channels',
  price: 'Price',
  expDate: 'Expiration Date',
}

export type SubscriptionDetails = {
    [K in keyof typeof subscriptionHeaders]: string
  }

const eventsHeaders = {
  name: 'Name',
  type: 'Type',
  param: 'Parameter',
  channels: 'Channels',
}

export type SubscriptionEvents = Item & {
    [K in keyof typeof eventsHeaders]: React.ReactElement
  }

type Props = {
  details: SubscriptionDetails
  events?: Array<SubscriptionEvents>
  onClose: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

const NotifierDetails: FC<Props> = ({
  details,
  events,
  onClose,
}) => (
  <StyledDialog
    open={Boolean(details)}
    onClose={onClose}
  >
    {/* Close btn */}
    <CrossBtn onClick={onClose} hoverText="close modal" />
    <Grid
      container
      spacing={2}
      wrap="nowrap"
      direction="column"
      alignItems="center"
    >
      {/* Title */}
      <Grid item>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
        >
          Notification plan
        </Typography>
      </Grid>

      {/* Description */}
      <Grid
        item
        xs={4}
        container
        direction="column"
        wrap="nowrap"
        spacing={1}
        sm={6}
      >
        {
          Object.keys(subscriptionHeaders).map((detailsHeader) => (
            <Grid
              key={detailsHeader}
              item
              container
              wrap="nowrap"
              spacing={2}
            >
              <Grid item xs={6}>
                <MarketplaceCell style={{ textAlign: 'right' }}>
                  {String(subscriptionHeaders[detailsHeader]).toUpperCase() }
                </MarketplaceCell>
              </Grid>
              <Grid item xs={6}>
                <MarketplaceCell color="textPrimary">
                  {details[detailsHeader]}
                </MarketplaceCell>
              </Grid>
            </Grid>
          ))
        }
      </Grid>

      {/* Events */}
      <Grid
        item
        xs="auto"
        sm={6}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          color="primary"
        >
          Listened Events
        </Typography>
      </Grid>
      <Grid
        item
        xs={3}
        sm={12}
        container
        justify="center"
        direction="column"
        alignItems="center"
        style={{ paddingTop: '-16px' }}
      >
        <Grid item>
          {events?.length && (
          <TableContainer>
            <Marketplace
              isLoading={false}
              headers={eventsHeaders}
              items={events}
            />
          </TableContainer>
          )}
          {
            !events?.length && (
              <MarketplaceCell>
                There seem to be no events here.
              </MarketplaceCell>
            )
          }
        </Grid>
      </Grid>
      {/* Actions */}
      <Grid
        item
        xs={2}
        sm={6}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <RoundBtn onClick={logNotImplemented('cancel handle')}>
            Cancel plan
          </RoundBtn>
        </Grid>
      </Grid>
    </Grid>
  </StyledDialog>
)
export default NotifierDetails

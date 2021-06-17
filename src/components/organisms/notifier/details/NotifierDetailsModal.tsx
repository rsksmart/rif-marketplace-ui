import React from 'react'
import Grid from '@material-ui/core/Grid'
import TableContainer from '@material-ui/core/TableContainer'
import Typography from '@material-ui/core/Typography'
import MarketplaceCell from 'components/atoms/MarketplaceCell'
import RifDialog from 'components/organisms/RifDialog'
import Marketplace from 'components/templates/marketplace/Marketplace'
import { Item } from 'models/Market'

export const baseSubscriptionHeaders = {
  id: 'Subscription ID',
  amount: 'Notifications',
  channels: 'Channels',
  price: 'Price',
  expDate: 'Expiration Date',
} as const

const eventsHeaders = {
  name: 'Name',
  type: 'Type',
  contract: 'Contract',
  channels: 'Channels',
}

export type SubscriptionEventsDisplayItem = Item & {
    [K in keyof typeof eventsHeaders]: React.ReactElement
  }

type Props<H extends typeof baseSubscriptionHeaders, T> = {
  headers: H
  details: T
  events?: Array<SubscriptionEventsDisplayItem>
  onClose: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  actions: React.ReactNode
}

const NotifierDetails = <H extends typeof baseSubscriptionHeaders, T, >({
  headers,
  details,
  events = [],
  onClose,
  actions,
}: Props<H, T>): React.ReactElement => (
  <RifDialog
    open={Boolean(details)}
    onClose={onClose}
  >
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
          Object.keys(headers).map((detailsHeader) => (
            <Grid
              key={detailsHeader}
              item
              container
              wrap="nowrap"
              spacing={2}
            >
              <Grid item xs={6}>
                <MarketplaceCell style={{ textAlign: 'right' }}>
                  {String(headers[detailsHeader]).toUpperCase() }
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
          {Boolean(events.length) && (
          <TableContainer>
            <Marketplace
              isLoading={false}
              headers={eventsHeaders}
              items={events}
            />
          </TableContainer>
          )}
          {
            !events.length && (
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
          {actions}
        </Grid>
      </Grid>
    </Grid>
  </RifDialog>
  )
export default NotifierDetails

import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import ExpandableOffer from 'components/organisms/storage/myoffers/ExpandableOffer'
import { StorageOffer } from 'models/marketItems/StorageItem'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import RoundedCard from 'components/atoms/RoundedCard'

export interface OffersListProps {
  items: StorageOffer[]
}

const useStyles = makeStyles((theme: Theme) => ({
  expandableOffer: {
    margin: theme.spacing(2, 0),
  },
  noOffers: {
    padding: theme.spacing(4),
  },
}))

const OffersList: FC<OffersListProps> = ({ items }) => {
  const classes = useStyles()

  if (!items.length) {
    return (
      <RoundedCard color="secondary">
        <Grid container className={classes.noOffers}>
          <Typography align="center" color="secondary">No offers created yet</Typography>
        </Grid>
      </RoundedCard>
    )
  }

  return (
    <Grid container>
      {
        items.map((storageOffer: StorageOffer, i) => (
          <ExpandableOffer
            key={storageOffer.id}
            className={classes.expandableOffer}
            offerName={`Offer ${i + 1}`}
            storageOffer={storageOffer}
            initiallyExpanded={!i}
          />
        ))
      }
    </Grid>
  )
}

export default OffersList

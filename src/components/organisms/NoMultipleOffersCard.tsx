import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TitledRoundedCard from 'components/molecules/TitledRoundedCard'
import React, { FC } from 'react'
import RoundBtn from 'components/atoms/RoundBtn'
import { NavLink, useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { Box } from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'

const useStyles = makeStyles(() => ({
  myOffersLink: {
    color: colors.gray4,
  },
}))

type Service = 'storage' | 'notifier'

const MY_OFFERS_ROUTE: Record<Service, string> = {
  storage: ROUTES.STORAGE.MYOFFERS.BASE,
  notifier: ROUTES.NOTIFIER.MYOFFERS.BASE,
}

type Props = {
  service: Service
}

const NoMultipleOffersCard: FC<Props> = ({ service }) => {
  const classes = useStyles()
  const history = useHistory()

  const navigateMyOffers = (): void => history.push(MY_OFFERS_ROUTE[service])

  return (
    <Grid container justify="center">
      <TitledRoundedCard
        title="Multiple offers is not supported yet"
        titleProps={{ variant: 'h6', color: 'primary' }}
        roundedCardProps={{ color: 'secondary' }}
      >
        <Grid item xs={12}>
          <Typography
            component="div"
            color="secondary"
            align="center"
            gutterBottom
          >
            An offer is already created for the selected account.
            <br />
            {'You can edit your current offer in '}
            <NavLink to={MY_OFFERS_ROUTE[service]} className={classes.myOffersLink}>
              <Box display="inline" fontWeight="fontWeightMedium">
                My Offers
              </Box>
            </NavLink>
            {' section.'}
          </Typography>
        </Grid>
        <Grid container justify="center">
          <RoundBtn onClick={navigateMyOffers}>Go to My Offers</RoundBtn>
        </Grid>
      </TitledRoundedCard>
    </Grid>
  )
}

export default NoMultipleOffersCard

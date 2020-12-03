import Grid from '@material-ui/core/Grid'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles'
import RoundedCard, { RoundedCardProps } from 'components/atoms/RoundedCard'
import React, { FC } from 'react'
import { colors } from '@rsksmart/rif-ui'

export interface TitledRoundedCardProps {
  roundedCardProps: RoundedCardProps
  title: string
  titleProps: TypographyProps
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: theme.spacing(70),
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
  },
  titleContainer: {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${colors.gray3}`,
  },
  contentContainer: {
    padding: theme.spacing(3),
  },
}))

// TODO: extract to rif-ui
const TitledRoundedCard: FC<TitledRoundedCardProps> = ({
  roundedCardProps, title, titleProps, children,
}) => {
  const classes = useStyles()
  return (
    <RoundedCard className={classes.root} {...roundedCardProps}>
      <Grid container className={classes.titleContainer} justify="center">
        <Typography {...titleProps}>{title}</Typography>
      </Grid>
      <Grid container className={classes.contentContainer} justify="center" spacing={2}>
        {children}
      </Grid>
    </RoundedCard>
  )
}

export default TitledRoundedCard

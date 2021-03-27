import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import React, { FC } from 'react'
import lostAstronaut from 'assets/images/lostAstronaut.png'
import GridRow from 'components/atoms/GridRow'
import RoundBtn from 'components/atoms/RoundBtn'
import { makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  img: {
    width: '100%',
    maxWidth: theme.spacing(150),
  },
}))

const UncaughtError: FC = () => {
  const classes = useStyles()
  return (
    <CenteredPageTemplate
      title="Oops! Something went wrong."
      subtitle="We are sorry but something went wrong."
    >
      <GridRow justify="center">
        <RoundBtn onClick={(): void => {
          window.location.href = window.location.origin
        }}
        >
          Go to Home Page
        </RoundBtn>
      </GridRow>
      <GridRow justify="center">
        <img
          className={classes.img}
          src={lostAstronaut}
          alt="lost astronaut"
        />
      </GridRow>
    </CenteredPageTemplate>
  )
}

export default UncaughtError

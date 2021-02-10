import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import React, { FC } from 'react'
import lostAstronaut from 'assets/images/lostAstronaut.png'
import GridRow from 'components/atoms/GridRow'
import RoundBtn from 'components/atoms/RoundBtn'

const UncaughtError: FC = () => (
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
      <img src={lostAstronaut} alt="lost astronaut" />
    </GridRow>
  </CenteredPageTemplate>
)

export default UncaughtError

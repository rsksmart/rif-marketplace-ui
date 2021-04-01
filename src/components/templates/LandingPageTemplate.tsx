import React, { FC } from 'react'
import ServiceCategories from 'components/organisms/ServiceCategories'
/* eslint-disable-next-line import/no-unresolved */
import { makeStyles, Theme } from '@material-ui/core/styles'
import HeaderTongue, { HeaderTongueProps } from 'components/organisms/Header/HeaderTongue'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}))

const headerTongueProps: HeaderTongueProps = {
  titleLine1: 'Your marketplace',
  titleLine2: 'for decentralized services',
  description: `RIF Marketplace provides a digital catalog with a wide range of decentralized service 
      listings, allowing providers to publish their services and engage with users in a secure and efficient way.`,
}

const LandingPageTemplate: FC = () => {
  const classes = useStyles()
  return (
    <>
      <HeaderTongue {...headerTongueProps} />
      <div className={classes.root}>
        <ServiceCategories />
      </div>
    </>
  )
}

export default LandingPageTemplate

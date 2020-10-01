import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { colors } from '@rsksmart/rif-ui'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
  },
  mainTitle: {
    fontSize: theme.typography.pxToRem(50),
  },
  subtitle: {
    margin: theme.spacing(4, 0),
  },
  infoContainer: {
    color: colors.gray5,
    maxWidth: '90%',
    [theme.breakpoints.up('md')]: {
      maxWidth: '80%',
    },
  },
  textContent: {
    marginBottom: theme.spacing(4),
  },
}))

const AboutPage: FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography className={classes.mainTitle} color="primary" variant="h1">About RIF</Typography>
      <div className={classes.infoContainer}>
        <Typography className={classes.subtitle} variant="h4" color="primary" />
        <div className={classes.textContent}>
          <Typography variant="body1">
            RIF aims to create the building blocks to construct a fully decentralized Internet.
            All RIF services are designed to facilitate the interaction of the global community of developers and blockchain technology.
            Bitcoin has proven to allow the peer-to-peer, censorship resistant transfer of value and now RIF, powered by RSK, aims to add the identity, storage, communication, micro-payments and gateways layers to allow the creation of Decentralized Sharing Economies to protect the rights of the individual and users.
          </Typography>
          <Typography variant="body1">
            By providing the infrastructure and services needed to enable Blockchain mass adoption, RIF hopes to contribute to the transformation and improvement of the lives of millions of financially excluded individuals around the world.
          </Typography>

        </div>
        <Typography className={classes.subtitle} variant="h4" color="primary">About the RIF Marketplace</Typography>
        <div className={classes.textContent}>
          <Typography variant="body1">
            RIF Marketplace provides a one-stop shop for a wide variety of decentralized services, presenting at the same time a common unified/simplified interface and user experience.
            The RIF Marketplace is where  service providers connect with their potential users. It is the cornerstone for the exchange of services in the Decentralized Sharing Economies (DSE) built on top of RSK and RIF.
            It covers all the services and building blocks required to develop decentralized applications and systems such as Storage, Communications, Data Services, Name Services, among others.
          </Typography>
          <Typography variant="body1">
            <br />
            <br />
            <b><i>&ldquo;Making blockchain technology easier, faster and scalable to foster mass adoption&rdquo;</i></b>
          </Typography>

        </div>

      </div>
    </div>
  )
}

export default AboutPage

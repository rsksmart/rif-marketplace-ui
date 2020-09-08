import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'

export interface CenteredPageTemplateProps {
  className?: string
  title?: string
  subtitle?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '80%',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '70%',
    },
    position: 'relative',
    width: '100%',
  },
}))

const CenteredPageTemplate: FC<CenteredPageTemplateProps> = ({
  className = '', title, subtitle, children,
}) => {
  const classes = useStyles()
  return (
    <Grid className={className} container justify="center">
      <div className={classes.container}>
        {
          !!title && (
            <Typography gutterBottom align="center" variant="h5" color="primary">{title}</Typography>
          )
        }
        {
          !!subtitle && (
            <Typography gutterBottom color="secondary" variant="subtitle1" align="center">
              {subtitle}
            </Typography>
          )
        }
        {children}
      </div>
    </Grid>
  )
}

export default CenteredPageTemplate

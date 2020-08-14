import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

export interface CenteredPageTemplateProps {
  title: string
  subtitle?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(10),
    width: '100%',
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: theme.spacing(100),
    },
    position: 'relative',
    width: '100%',
  },
}))

const CenteredPageTemplate: FC<CenteredPageTemplateProps> = ({ title, subtitle, children }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={`${classes.container}`}>
        <Typography gutterBottom variant="h5" color="primary">{title}</Typography>
        {
          !!subtitle && (
            <Typography gutterBottom color="secondary" variant="subtitle1" align="center">
              {subtitle}
            </Typography>
          )
        }
        {children}
      </div>
    </div>
  )
}

export default CenteredPageTemplate

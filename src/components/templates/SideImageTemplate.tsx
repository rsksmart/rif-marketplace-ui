import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

export interface SideImageTemplateProps {
  mainTitle: string
  sideIcon: React.ReactElement
  sideText: React.ReactElement
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '90%',
    [theme.breakpoints.up('md')]: {
      maxWidth: '80%',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    display: 'flex',
  },
  mainTitle: {
    fontSize: theme.typography.pxToRem(50),
    marginBottom: theme.spacing(4),
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing(2, 0),
  },
  textContent: {
    maxWidth: '90%',
    [theme.breakpoints.up('md')]: {
      maxWidth: '80%',
    },
  },
}))

const SideImageTemplate: FC<SideImageTemplateProps> = ({ mainTitle, sideIcon, sideText }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography className={classes.mainTitle} color="primary" variant="h1">{mainTitle}</Typography>
        <Grid container className={classes.gridContainer}>
          <Grid item className={classes.content} sm={12} md={6} lg={4}>
            {sideIcon}
          </Grid>
          <Grid item className={classes.content} sm={12} md={6} lg={8}>
            <div className={classes.textContent}>
              {sideText}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default SideImageTemplate

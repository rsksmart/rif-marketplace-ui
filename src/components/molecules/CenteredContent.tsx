import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => createStyles({
  bodyContainer: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '80%',
    },
  },
}))


const CenteredContent: FC<{}> = ({ children }) => {
  const classes = useStyles()
  return (
    <Grid
      container
      direction="column"
      alignContent="center"
    >
      <div className={classes.bodyContainer}>
        {children}
      </div>
    </Grid>
  )
}

export default CenteredContent

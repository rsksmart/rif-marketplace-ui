import React, { FC, useState } from 'react'
import Fab from '@material-ui/core/Fab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import {
  Box, Grid, Grow, Typography,
} from '@material-ui/core'
import { Button, colors } from '@rsksmart/rif-ui'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    border: `${colors.primary} 1px solid`,
    maxWidth: '700px',
    alignItems: 'center',
    borderRadius: '50px 0px 0px 50px',
    paddingRight: '40px',
  },
  infoColumn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  stakingIcon: {
    height: '80px',
    minWidth: '80px',
    marginLeft: '-40px',
  },
}))

const Staking: FC<{}> = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(true)

  const handleExpandClick = () => setExpanded((exp) => !exp)

  return (
    <div className={classes.root}>
      <Grow in={expanded}>
        <Grid
          container
          className={classes.infoContainer}
        >
          <Grid
            item
            xs={4}
            className={classes.infoColumn}
          >
            <Typography component="div" color="secondary">
              <Box fontWeight="fontWeightRegular">
                BALANCE
              </Box>
            </Typography>
            <Typography color="primary" variant="h6">2048 RIF</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            className={classes.infoColumn}
          >
            <Button color="primary" rounded variant="outlined">
              Add funds
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            className={classes.infoColumn}
          >
            <Button rounded variant="outlined">
              Withdraw funds
            </Button>
          </Grid>
        </Grid>
      </Grow>
      <Fab
        className={classes.stakingIcon}
        color="primary"
        aria-label="staking"
        onClick={handleExpandClick}
      >
        <AddIcon />
      </Fab>
    </div>
  )
}

export default Staking

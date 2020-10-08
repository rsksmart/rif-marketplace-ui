import React, { FC, useState } from 'react'
import Fab from '@material-ui/core/Fab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { Grid, Grow, Typography } from '@material-ui/core'
import { Button, colors } from '@rsksmart/rif-ui'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  paper: {
    margin: theme.spacing(1),
  },
  svg: {
    width: 100,
    height: 100,
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
  },
}))

const Staking: FC<{}> = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(true)
  return (
    <div className={classes.root}>
      <Grow in={expanded}>
        <Grid
          container
          style={{
            border: `${colors.primary} 1px solid`,
            maxWidth: '700px',
            alignItems: 'center',
            borderRadius: '50px 0px 0px 50px',
            paddingRight: '40px',
          }}
        >
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography style={{ color: colors.gray5 }}>
              BALANCE
            </Typography>
            <Typography color="primary" variant="h6">2048 RIF</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button color="primary" rounded variant="outlined">
              Add funds
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button rounded variant="outlined">
              Withdraw funds
            </Button>
          </Grid>
        </Grid>
      </Grow>
      <Fab
        color="primary"
        aria-label="staking"
        onClick={() => setExpanded(!expanded)}
        style={{
          height: '80px',
          minWidth: '80px',
          marginLeft: '-40px',
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  )
}

export default Staking

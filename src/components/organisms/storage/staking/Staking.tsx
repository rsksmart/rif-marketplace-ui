import React, { FC, useState } from 'react'
import Fab from '@material-ui/core/Fab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { Fade, Paper } from '@material-ui/core'

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
  const [checked, setChecked] = useState(false)
  return (
    <div className={classes.root}>
      <Fade in={checked}>
        <Paper elevation={4} className={classes.paper}>
          <svg className={classes.svg}>
            <polygon points="0,100 50,00, 100,100" className={classes.polygon} />
          </svg>
        </Paper>
      </Fade>

      <Fab color="primary" aria-label="staking" onClick={() => setChecked(!checked)}>

        <AddIcon />
      </Fab>
    </div>
  )
}

export default Staking

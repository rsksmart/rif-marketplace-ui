import React, { FC } from 'react'
import Fab from '@material-ui/core/Fab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

const Staking: FC<{}> = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Fab color="primary" aria-label="staking">
        <AddIcon />
      </Fab>
    </div>
  )
}

export default Staking

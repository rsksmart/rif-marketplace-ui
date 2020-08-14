import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core'
import React, { FC } from 'react'
import { colors, WithSpinner } from '@rsksmart/rif-ui'

const useStyles = makeStyles((theme: Theme) => createStyles({
  filter: {
    background: colors.white,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    flex: '1 1 auto',
    padding: theme.spacing(3, 3, 0, 3),
    [theme.breakpoints.down('sm')]: {
      maxHeight: '100%',
    },
    [theme.breakpoints.up('md')]: {
      height: '100%',
      minHeight: theme.spacing(60),
    },
  },
}))

const MarketFilter: FC<{}> = ({ children }) => {
  const classes = useStyles()

  return (
    <div className={classes.filter}>
      {children}
    </div>
  )
}

export default WithSpinner(MarketFilter)

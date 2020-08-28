import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Button } from '@rsksmart/rif-ui'
import JobDoneBox from 'components/molecules/JobDoneBox'
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate'
import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'

const useStyles = makeStyles((_: Theme) => createStyles({
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: '3em',
    width: 355,
  },
}))

const DomainListed: FC<{}> = () => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <TxCompletePageTemplate>
      <JobDoneBox text="Your domain has been listed." />
      {/* <a href=''>Check it in the explorer</a> */}
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          rounded
          shadow
          onClick={() => { history.push(ROUTES.RNS.SELL.BASE, { refresh: true }) }}
        >
          View my domains
        </Button>
        <Button
          color="primary"
          variant="contained"
          rounded
          shadow
          onClick={() => { history.push(ROUTES.RNS.BUY.BASE, { refresh: true }) }}
        >
          View domain listing
        </Button>
      </div>
    </TxCompletePageTemplate>
  )
}

export default DomainListed

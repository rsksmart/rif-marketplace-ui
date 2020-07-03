import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Button } from '@rsksmart/rif-ui'
import JobDoneBox from 'components/molecules/JobDoneBox'
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate'
import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import networkConfig from 'ui-config.json'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const { rnsManagerUrl } = networkConfig[network]

const useStyles = makeStyles((theme: Theme) => createStyles({
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: theme.spacing(3),
    width: 355,
  },
}))

const DomainPurchased: FC<{}> = () => {
  const classes = useStyles()
  const history = useHistory()
  const routeState = history.location.state as { domainName: string }
  const domainName = routeState?.domainName

  if (!domainName) return null

  return (
    <TxCompletePageTemplate>
      <JobDoneBox text="Your domain has been bought." />
      {/* <a href=''>Check it in the explorer</a> */}
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          rounded
          shadow
          disabled={!rnsManagerUrl}
          onClick={() => { window.open(`${rnsManagerUrl}?autologin=${domainName}`, '_blank') }}
        >
          Admin my domain
        </Button>
        <Button
          color="primary"
          variant="contained"
          rounded
          shadow
          onClick={() => { history.push(ROUTES.DOMAINS.BUY) }}
        >
          Buy another domain
        </Button>
      </div>
    </TxCompletePageTemplate>
  )
}

export default DomainPurchased

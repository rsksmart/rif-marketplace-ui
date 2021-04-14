import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import RoundedCard from 'components/atoms/RoundedCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import {
  Spinner,
  theme, Web3Store,
} from '@rsksmart/rif-ui'
import WithLoginCard from 'components/hoc/WithLoginCard'
import GridRow from 'components/atoms/GridRow'
import PurchasesTable from 'components/organisms/notifier/mypurchase/PurchasesTable'
import AppContext, { AppContextProps } from 'context/App'
import NotifierService from '../../../../api/rif-notifier-service'

const useTitleStyles = makeStyles(() => ({
  root: {
    marginBlockStart: `${theme.spacing(2)}px`,
    marginInlineStart: `${theme.spacing(2)}px`,
  },
}))

const NotifierMyPurchasePage: FC = () => {
  // const history = useHistory()
  const titleStyleClass = useTitleStyles()
  const [subscriptions, setSubscriptions] = useState([
    {
      subscriptionId: 'Subscription ID',
      provider: 'Provider',
      notifications: 'Notifications',
      expirationDate: 'Expiration Date',
      price: 'Price',
      renew: '',
      view: '',
    },
  ])
  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: { loaders: { data: isLoadingData } },
  } = useContext<AppContextProps>(AppContext)

  // get subscriptions
  useEffect(() => {
    if (account) {

    }
  }, [account])

  return (
    <CenteredPageTemplate>
      <RoundedCard color="secondary">
        <GridColumn>
          <GridItem>
            <Typography
              gutterBottom
              color="primary"
              variant="subtitle1"
              classes={titleStyleClass}
            >
              Active plans
            </Typography>
          </GridItem>
          <GridRow>
            {
                isLoadingData
                  ? <Spinner />
                  : (
                    <PurchasesTable
                      subscriptions={subscriptions}
                    />
                  )
              }
          </GridRow>
        </GridColumn>
      </RoundedCard>

    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: NotifierMyPurchasePage,
  title: 'Connect your wallet to see your purchases',
  contentText: 'Connect your wallet to get detailed information about your purchases',
})

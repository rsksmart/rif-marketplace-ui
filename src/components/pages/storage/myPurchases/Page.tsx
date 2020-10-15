import React, { FC, useContext } from 'react'
import {
  makeStyles, TableContainer, Typography,
} from '@material-ui/core'
import RoundedCard from 'components/atoms/RoundedCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import Marketplace from 'components/templates/marketplace/Marketplace'
import MarketContext from 'context/Market/MarketContext'
import AgreementsContext, { AgreementContextProps } from 'context/Services/storage/agreements'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import { theme } from '@rsksmart/rif-ui'
import createItemFields from './utils'

const useTitleStyles = makeStyles(() => ({
  root: {
    marginBlockStart: `${theme.spacing(2)}px`,
    marginInlineStart: `${theme.spacing(2)}px`,
  },
}))

const MyStoragePurchases: FC = () => {
  const titleStyleClass = useTitleStyles()
  const {
    state: {
      agreements,
    },
  } = useContext<AgreementContextProps>(AgreementsContext)
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)

  const headers = {
    title: 'Title',
    provider: 'Provider',
    contentSize: 'Content size',
    renewalDate: 'Renewal date',
    subscriptionType: 'Subscription type',
    monthlyFee: 'Monthly fee',
    renew: '',
    view: '',
  }

  const items = createItemFields(agreements, crypto, currentFiat)

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
              Active contracts

            </Typography>
          </GridItem>
          <GridItem>
            <TableContainer>
              <Marketplace
                headers={headers}
                isLoading={false}
                items={items}
              />
            </TableContainer>
          </GridItem>
        </GridColumn>
      </RoundedCard>

    </CenteredPageTemplate>
  )
}

export default MyStoragePurchases

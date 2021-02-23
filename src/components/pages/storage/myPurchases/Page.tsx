import React, {
  FC, useContext, useEffect,
} from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import RoundedCard from 'components/atoms/RoundedCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import AgreementsContext, {
  AgreementContextProps,
} from 'context/Services/storage/agreements'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import {
  Spinner,
  theme, Web3Store,
} from '@rsksmart/rif-ui'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { Agreement } from 'models/marketItems/StorageItem'
import WithLoginCard from 'components/hoc/WithLoginCard'
import GridRow from 'components/atoms/GridRow'
import InfoBar from 'components/molecules/InfoBar'
import PurchasesTable from 'components/organisms/storage/mypurchases/PurchasesTable'
import AppContext, { AppContextProps } from 'context/App'
import useConfirmations from 'hooks/useConfirmations'

const useTitleStyles = makeStyles(() => ({
  root: {
    marginBlockStart: `${theme.spacing(2)}px`,
    marginInlineStart: `${theme.spacing(2)}px`,
  },
}))

const MyStoragePurchases: FC = () => {
  const history = useHistory()
  const titleStyleClass = useTitleStyles()
  const {
    state: {
      agreements,
    },
    dispatch: agreementsDispatch,
  } = useContext<AgreementContextProps>(AgreementsContext)
  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: { loaders: { data: isLoadingData } },
  } = useContext<AppContextProps>(AppContext)

  const newAgreementsConfsCount = useConfirmations(['AGREEMENT_NEW']).length

  // filters agreements by current account
  useEffect(() => {
    if (account) {
      agreementsDispatch({
        type: 'SET_FILTERS',
        payload: { consumer: account },
      })
    }
  }, [account, agreementsDispatch])

  const onRenewAgreement = (agreement: Agreement): void => {
    agreementsDispatch({
      type: 'SET_ORDER',
      payload: agreement,
    })
    history.push(ROUTES.STORAGE.MYPURCHASES.RENEW)
  }

  return (
    <CenteredPageTemplate>
      {
        Boolean(newAgreementsConfsCount) &&
        (
          <InfoBar
            isVisible
            type="info"
            text={`Waiting confirmations for
            ${newAgreementsConfsCount} new agreement(s)`}
          />
        )
      }
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
          <GridRow>
            {
              isLoadingData
                ? <Spinner />
                : (
                  <PurchasesTable
                    agreements={agreements}
                    onRenewAgreement={onRenewAgreement}
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
  WrappedComponent: MyStoragePurchases,
  title: 'Connect your wallet to see your purchases',
  contentText: 'Connect your wallet to get detailed information about your purchases',
})

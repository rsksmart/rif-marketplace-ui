import Typography from '@material-ui/core/Typography'
import TableContainer from '@material-ui/core/TableContainer'
import {
  AgreementProviderView,
  AgreementView,
  createProviderItemFields,
} from 'components/organisms/storage/agreements/utils'
import Marketplace from 'components/templates/marketplace/Marketplace'
import MarketContext from 'context/Market/MarketContext'
import { Agreement } from 'models/marketItems/StorageItem'
import React, { FC, useContext, useState } from 'react'
import RoundBtn from 'components/atoms/RoundBtn'
import DetailsModal from '../agreements/DetailsModal'

export type ActiveContractsProps = {
  agreements: Agreement[]
}

const ActiveContracts: FC<ActiveContractsProps> = ({ agreements }) => {
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)

  const [
    itemDetails,
    setItemDetails,
  ] = useState<AgreementProviderView | undefined>(undefined)

  if (!agreements.length) {
    return (
      <Typography
        align="center"
        color="secondary"
      >
        No active contracts yet
      </Typography>
    )
  }
  const items = createProviderItemFields(
    agreements,
    crypto,
    currentFiat,
    () => undefined,
    (_, agreementView: AgreementView) => {
      setItemDetails(agreementView as AgreementProviderView)
    },
  )

  const headers = {
    customer: 'Customer',
    contentSize: 'Content size',
    renewalDate: 'Renewal date',
    subscriptionPeriod: 'Subscription type',
    monthlyFee: 'Monthly fee',
    availableFunds: 'Available funds',
    withdraw: '',
    view: '',
  }

  const actions = (): JSX.Element => (
    <RoundBtn
      onClick={(): void => undefined}
    >
      Withdraw funds
    </RoundBtn>
  )

  return (
    <>
      <TableContainer>
        <Marketplace
          headers={headers}
          isLoading={false}
          items={items}
        />
      </TableContainer>
      <DetailsModal
        modalProps={{
          open: Boolean(itemDetails),
          onBackdropClick: (): void => setItemDetails(undefined),
          onEscapeKeyDown: (): void => setItemDetails(undefined),
        }}
        itemDetails={itemDetails}
        actions={actions}
      />
    </>
  )
}

export default ActiveContracts

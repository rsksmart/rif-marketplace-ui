import React, { FC, useContext } from 'react'
import {
  Button,
  Grid, makeStyles, TableContainer, Typography,
} from '@material-ui/core'
import RoundedCard from 'components/atoms/RoundedCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import AgreementsContext, { AgreementContextProps } from 'context/Services/storage/agreements'
import { Agreement } from 'models/marketItems/StorageItem'
import Marketplace from 'components/templates/marketplace/Marketplace'
import { shortenString } from '@rsksmart/rif-ui'
import { AddressItem } from 'components/molecules'

const useStyles = makeStyles(() => ({
  root: {

  },
}))

const MyStoragePurchases: FC = () => {
  const {
    state: {
      agreements,
    },
  } = useContext<AgreementContextProps>(AgreementsContext)
  const classes = useStyles()

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

  type Fields = {
      [K in keyof typeof headers]: string | JSX.Element
  }

  const items: Fields[] = agreements.map(({
    provider,
    monthlyFee,
    renewalDate,
    size,
    subscriptionPeriod,
    title,
    id,
  }: Agreement) => ({
    id,
    title: <AddressItem value={title || id} />,
    contentSize: size,
    monthlyFee: monthlyFee.toPrecision(2),
    provider: <AddressItem value={provider} />,
    renewalDate: renewalDate.toLocaleDateString(),
    subscriptionType: subscriptionPeriod,
    renew: <Button>Renew</Button>,
    view: <Button>View</Button>,
  }))

  return (
    <CenteredPageTemplate>
      <RoundedCard color="secondary">
        <Grid container>
          <Typography gutterBottom color="primary" variant="subtitle1">Active contracts</Typography>
          <TableContainer>
            <Marketplace
              headers={headers}
              isLoading={false}
              items={items}
            />
            {/* <Table
              aria-labelledby="table of active contracts"
              size="small"
              aria-label="enhanced table"
            >
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell>{header.toUpperCase()}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {}
              </TableBody>
            </Table> */}
          </TableContainer>
        </Grid>
      </RoundedCard>

    </CenteredPageTemplate>
  )
}

export default MyStoragePurchases

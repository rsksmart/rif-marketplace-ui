import React, { FC } from 'react'
import {
  Grid, makeStyles, TableContainer, Typography,
} from '@material-ui/core'
import RoundedCard from 'components/atoms/RoundedCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'

const useStyles = makeStyles(() => ({
  root: {

  },
}))

const MyStoragePurchases: FC = () => {
  const classes = useStyles()

  const headers = {
    customer: 'customer',
    contentSize: 'content size',
    renewalDate: 'renewal date',
    subscriptionType: 'subscription type',
    monthlyFee: 'monthly fee',
    availableFunds: 'available funds',
    withdraw: '',
    view: '',
  }

  type Fields = {
      [K in keyof typeof headers]: string | JSX.Element
  }

  //   const items: Fields[] =

  return (
    <CenteredPageTemplate>
      <RoundedCard color="secondary">
        <Grid container>
          <Typography gutterBottom color="primary" variant="subtitle1">Active contracts</Typography>
          <TableContainer>
            {/* <Marketplace
                headers={headers}
            /> */}
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

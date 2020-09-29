import {
  Typography, Button, Table, TableBody, TableRow, makeStyles, TableCell,
} from '@material-ui/core'
import { colors, Web3Store } from '@rsksmart/rif-ui'
import GridColumn from 'components/atoms/GridColumn'
import Login from 'components/atoms/Login'
import RifCard from 'components/organisms/RifCard'
import { CheckoutContext } from 'components/pages/storage/buy/CheckoutContext'
import React, { FC, useContext } from 'react'

type Props = {
    details: {[name: string]: string | JSX.Element}
}

const useStyles = makeStyles(() => ({
  stepperCard: {
    display: 'flex',
    justifyContent: 'center',
  },
  contentDetails: {
    width: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  detailKey: {
    border: 'none',
  },
  detailValue: {
    border: 'none',
  },
}))

const ConfigPurchaseCard: FC<Props> = ({ details }) => {
  const classes = useStyles()

  const {
    state: {
      order,
      pinned,
      contract: {
        createAgreement,
      },
    },
  } = useContext(CheckoutContext)

  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  const submitWithLogin = (): JSX.Element => (account ? (
    <Button
      style={{
        background: colors.primary,
        color: colors.gray1,
      }}
      onClick={(): void => {
      // Validate input

        // Submit
        if (pinned) {
          const agreement = { ...order, ...pinned }
          createAgreement(agreement)
          console.log(': -------------------')
          console.log('agreement', agreement)
          console.log(': -------------------')
        }
      }}
    >
      Buy
    </Button>
  ) : <Login />)

  return (
    <RifCard
      Header={(): JSX.Element => (
        <Typography variant="h6" color="primary">Configuring storage plan</Typography>
      )}
      Actions={submitWithLogin}
    >
      <GridColumn justify="space-evenly">
        <Table className={classes.contentDetails}>
          <TableBody>
            {Object.keys(details).map((key) => (
              <TableRow key={key}>
                <TableCell className={classes.detailKey}>
                  <Typography variant="body2">
                    {key}
                  </Typography>
                </TableCell>
                <TableCell className={classes.detailValue}>
                  {details[key]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GridColumn>
    </RifCard>
  )
}

export default ConfigPurchaseCard

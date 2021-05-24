import React, { FC, useContext } from 'react'
import {
  makeStyles, Table, TableBody,
  TableCell, TableRow, Typography,
} from '@material-ui/core'
import { Web3Store } from '@rsksmart/rif-ui'
import GridColumn from 'components/atoms/GridColumn'
import Login from 'components/atoms/Login'
import RifCard from 'components/organisms/RifCard'
import { ButtonProps } from '@material-ui/core/Button'
import RoundBtn from 'components/atoms/RoundBtn'

type Details = {
  'CONTENT SIZE': string
  'CURRENCY TO PAY': JSX.Element
  'SUBSCRIPTION PERIOD': JSX.Element
  'PERIODS TO PREPAY': JSX.Element
  'TOTAL PRICE': JSX.Element | null
  'RENEWAL DATE': string
}

type Props = {
  details: Details
  submitProps: ButtonProps
  title: string
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

const StoragePurchaseCard: FC<Props> = ({
  details,
  submitProps,
  title,
}) => {
  const classes = useStyles()

  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  const submitWithLogin = (): JSX.Element => (account ? (
    <RoundBtn {...submitProps} />
  ) : <Login />)

  return (
    <RifCard
      Header={(): JSX.Element => (
        <Typography variant="h6" color="primary">{title}</Typography>
      )}
      Actions={submitWithLogin}
    >
      <GridColumn justify="space-evenly">
        <Table className={classes.contentDetails}>
          <TableBody>
            {Object.keys(details).map((name) => (
              <TableRow key={name}>
                <TableCell className={classes.detailKey}>
                  <Typography variant="body2">
                    {name}
                  </Typography>
                </TableCell>
                <TableCell className={classes.detailValue}>
                  {details[name]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GridColumn>
    </RifCard>
  )
}

export default StoragePurchaseCard
export type StoragePurchaseCardProps = Props
export type StoragePurchaseCardDetails = Details

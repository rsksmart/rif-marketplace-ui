import {
  Typography, Button, Table, TableBody, TableRow, makeStyles, TableCell,
} from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import GridColumn from 'components/atoms/GridColumn'
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
      agreement,
      contract: {
        createAgreement,
      },
    },
  } = useContext(CheckoutContext)

  return (
    <RifCard
      Header={(): JSX.Element => (
        <Typography variant="h6" color="primary">Configuring storage plan</Typography>
      )}
      Actions={(): JSX.Element => (
        <Button
          style={{
            background: colors.primary,
            color: colors.gray1,
          }}
          onClick={(): void => {
            // Validate input

            // Submit
            if (agreement) createAgreement(agreement)
            console.log(': -------------------')
            console.log('agreement', agreement)
            console.log(': -------------------')
          }}
        >
          Buy

        </Button>
      )}
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

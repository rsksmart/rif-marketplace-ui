import {
  Box, makeStyles, Step, StepLabel, Stepper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  TextFieldProps, Typography,
} from '@material-ui/core'
import { Button, colors } from '@rsksmart/rif-ui'
import Big from 'big.js'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import RoundedCard from 'components/atoms/RoundedCard'
import DropZone from 'components/molecules/DropZone'
import GridRow from 'components/molecules/storage/buy/GridRow'
import LabelWithValue from 'components/molecules/storage/buy/LabelWithValue'
import RifCard from 'components/organisms/RifCard'
import StoragePinTabs from 'components/organisms/storage/buy/StoragePinTabs'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import { StorageOrder } from 'context/Services/storage/interfaces'
import { OrderPayload } from 'context/Services/storage/offersActions'
import StorageOffersContext from 'context/Services/storage/OffersContext'
import React, { ChangeEvent, useContext, useState } from 'react'

const pinTabUploader = (
  <>
    <GridItem xs={12}>
      <GridRow
        justify="space-evenly"
      >
        <GridItem>
          <TextField
            id="contentName"
            label="Content name"
            variant="outlined"
            required
          />
        </GridItem>
      </GridRow>
    </GridItem>
    <GridItem>
      <GridRow>
        <GridItem>
          <DropZone />
        </GridItem>
      </GridRow>
    </GridItem>
  </>
)

const pinTabHash = ({ name, size, hash }: {name: TextFieldProps, size: TextFieldProps, hash: TextFieldProps}) => (
  <>
    <GridItem>
      <Typography variant="body2">
        To ensure that your file persists in IPFS is necessary to pin it using its hash
      </Typography>
    </GridItem>
    <GridItem>
      <GridRow
        justify="space-evenly"
      >
        <GridItem>
          <TextField
            id="contentName"
            label="Content name"
            variant="outlined"
            {...name}
            required
          />
        </GridItem>
        <GridItem>
          <TextField
            id="contentSize"
            label="Content size"
            variant="outlined"
            {...size}
            required
          />
        </GridItem>
      </GridRow>
    </GridItem>
    <GridItem>
      <TextField
        id="hash"
        label="Hash"
        variant="outlined"
        required
        {...hash}
        style={{
          width: '100%',
        }}
      />
    </GridItem>
    <GridItem>
      <Typography variant="caption">
        You can find the hash of your file in your storage system (IPFS, SWARM)
      </Typography>
    </GridItem>
  </>
)

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

const StorageOffersCheckoutPage = () => {
  const classes = useStyles()
  const {
    state: {
      // order,
    },
    dispatch,
  } = useContext(StorageOffersContext)

  const order: StorageOrder = {
    item: {
      id: '0x01',
      location: 'UK',
      system: 'IPFS',
      availableSizeGB: new Big(10),
      plan: {
        period: 'Daily',
        price: new Big(1),
        currency: 'RBTC',
      },
      averagePrice: 1,
    },
    contentHash: '0xFACEOFF',
    contentName: 'TEST NAME',
    contentSize: '19MB',
    isProcessing: false,
  }

  const details = order && {
    'CONTENT SIZE': order.contentSize?.replace(/\w/, ''),
    'CURRENCY TO PAY': order.item.plan?.currency,
    'SUBSCRIPTION PERIOD': order.item.plan?.period,
    'PERIODS TO PREPAY': '',
    'TOTAL PRICE': '',
    'RENEWAL DATE': '',
  }

  const [pinType, setPinType] = useState(0)
  const [contentName, setContentName] = useState('TESST')
  const [contentSize, setContentSize] = useState('1')
  const [contentHash, setContentHash] = useState('0xFACE0FF')

  const handlePinTypeChange = (
    _: React.ChangeEvent<{}>, value: number,
  ): void => setPinType(value)

  const planConfiguration = () => {
    const a = ''
    return (
      <GridColumn alignContent="center">
        <Typography variant="caption">To buy your storage you have to select the currency, suscription and payment details to get the final price of your storage plan.</Typography>
      </GridColumn>
    )
  }

  // const pinnedContentSelector = () => {
  //   const a = ''

  //   return (

  //   )
  // }

  return (
    <CheckoutPageTemplate
      className="storage-checkout-page"
      backButtonProps={{
        backTo: 'offers',
      }}
    >
      <GridColumn
        className="rootContainer"
      >
        {/* DESCRIPTION */}
        <GridRow>
          <GridItem>
            <LabelWithValue
              label="Selected storage provider"
              value={order?.item.id}
            />
          </GridItem>
          <GridItem>
            <LabelWithValue
              label="System"
              value={order?.item.system}
            />
          </GridItem>
        </GridRow>
        {pinType ? (
          <GridRow>
            <GridItem>
              <Typography color="textPrimary" component="div">
                <Box display="inline" fontWeight="fontWeightMedium">
                  The size of your storage plan is calculated by the content that you upload/persist in this first step.
                </Box>
              </Typography>
            </GridItem>
          </GridRow>
        ) : ''}
        {/* STEPPER */}
        <GridItem>
          <GridRow justify="center">
            <GridItem xs={10}>
              <RoundedCard
                color="primary"
                className={classes.stepperCard}
              >
                <Stepper
                  activeStep={Number(Boolean(order?.contentHash))}
                  alternativeLabel
                >
                  <Step>
                    <StepLabel>Upload/Pin content</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Configure your storage plan</StepLabel>
                  </Step>
                </Stepper>
              </RoundedCard>
            </GridItem>
          </GridRow>
        </GridItem>
        {/* CONTENT */}
        {/* { Number(Boolean(order?.contentHash)) ? planConfiguration() : pinnedContentSelector()} */}
        <GridItem>
          <GridColumn alignContent="center">
            <GridItem>
              <RifCard
                Header={
                  order?.contentHash
                    ? () => (
                      <Typography variant="h6" color="primary">Configuring storage plan</Typography>
                    )
                    : () => (
                      <StoragePinTabs
                        value={pinType}
                        onChange={handlePinTypeChange}
                      />
                    )
}
                Actions={
                  order?.contentHash
                    ? () => (
                      <Button
                        style={{
                          background: colors.primary,
                          color: colors.gray1,
                        }}
                        onClick={(event) => {
                          // Validate input

                          // Submit
                          dispatch({
                            type: 'SET_ORDER',
                            payload: {
                              item: order?.item,
                              contentName,
                              contentSize,
                              contentHash,
                            } as OrderPayload,
                          })
                        }}
                      >
                        Buy

                      </Button>
                    )
                    : () => (
                      <Button
                        style={{
                          background: colors.primary,
                          color: colors.gray1,
                        }}
                        onClick={(event) => {
                          // Validate input

                          // Submit
                          dispatch({
                            type: 'SET_ORDER',
                            payload: {
                              item: order?.item,
                              contentName,
                              contentSize,
                              contentHash,
                            } as OrderPayload,
                          })
                        }}
                      >
                        {pinType ? 'Pin' : 'Upload'}
                      </Button>
                    )
}
              >
                <GridColumn
                  justify="space-evenly"
                >
                  {order?.contentHash
                    ? (
                      <Table className={classes.contentDetails}>
                        <TableBody>
                          {Object.keys(details).map((key) => (
                            <TableRow key={key}>
                              <TableCell className={classes.detailKey}><Typography variant="subtitle2">{key}</Typography></TableCell>
                              <TableCell className={classes.detailValue}>{details[key]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  )
                    : pinType ? pinTabHash({
                      name: {
                        value: contentName,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setContentName(event.target.value),
                      },
                      size: {
                        value: contentSize,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setContentSize(event.target.value),
                      },
                      hash: {
                        value: contentHash,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setContentHash(event.target.value),
                      },
                    }) : pinTabUploader}
                </GridColumn>
              </RifCard>
            </GridItem>
          </GridColumn>
        </GridItem>
      </GridColumn>
    </CheckoutPageTemplate>
  )
}
export default StorageOffersCheckoutPage

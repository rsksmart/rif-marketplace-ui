import {
  Box, Step, StepLabel, Stepper,
  TextField,
  TextFieldProps, Typography,
} from '@material-ui/core'
import { Button, colors } from '@rsksmart/rif-ui'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import DropZone from 'components/molecules/DropZone'
import GridRow from 'components/molecules/storage/buy/GridRow'
import LabelWithValue from 'components/molecules/storage/buy/LabelWithValue'
import RifCard from 'components/organisms/RifCard'
import StoragePinTabs from 'components/organisms/storage/buy/StoragePinTabs'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import { OrderPayload } from 'context/Services/storage/offersActions'
import StorageOffersContext from 'context/Services/storage/OffersContext'
import React, { ChangeEvent, useContext, useState } from 'react'
import Big from 'big.js'
import { StorageItem } from 'models/marketItems/StorageItem'

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

const StorageOffersCheckoutPage = () => {
  const {
    state: {
      // order,
    },
    dispatch,
  } = useContext(StorageOffersContext)

  const order: { item: StorageItem, contentHash?: string} = {
    item: {
      id: '0x01',
      location: 'UK',
      system: 'IPFS',
      availableSizeGB: new Big(10),
      subscriptionOptions: [
        {
          period: 'Daily',
          price: new Big(1),
          currency: 'RBTC',
        },
      ],
      averagePrice: 1,
    },
    contentHash: '0xFACEOFF',
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
      <GridColumn>
        <Typography variant="caption">To buy your storage you have to select the currency, suscription and payment details to get the final price of your storage plan.</Typography>
      </GridColumn>
    )
  }

  const pinnedContentSelector = () => {
    const a = ''

    return (
      <GridColumn alignContent="center">
        <GridItem>
          <RifCard
            Header={() => (
              <StoragePinTabs
                value={pinType}
                onChange={handlePinTypeChange}
              />
            )}
            Actions={() => (
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
            )}
          >
            <GridColumn
              justify="space-evenly"
            >
              {pinType ? pinTabHash({
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
    )
  }

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
        <GridRow>
          <GridItem>
            <Typography color="textPrimary" component="div">
              <Box display="inline" fontWeight="fontWeightMedium">
                The size of your storage plan is calculated by the content that you upload/persist in this first step.
              </Box>
            </Typography>
          </GridItem>
        </GridRow>
        {/* STEPPER */}
        <Stepper
          activeStep={Number(Boolean(order?.contentHash))}
          {...{}}
        >
          <Step>
            <StepLabel>Upload/Pin content</StepLabel>
          </Step>
          <Step>
            <StepLabel>Configure your storage plan</StepLabel>
          </Step>
        </Stepper>
        {/* CONTENT */}
        { Number(Boolean(order?.contentHash)) ? planConfiguration() : pinnedContentSelector()}
      </GridColumn>
    </CheckoutPageTemplate>
  )
}
export default StorageOffersCheckoutPage

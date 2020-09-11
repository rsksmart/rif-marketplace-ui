import {
  Step, StepLabel, Stepper,
  Tab, Tabs,
  TextField,
  Typography, Box,
} from '@material-ui/core'
import GridRow from 'components/molecules/storage/buy/GridRow'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import React from 'react'
import GridItem from 'components/atoms/GridItem'
import GridColumn from 'components/atoms/GridColumn'
import LabelWithValue from 'components/molecules/storage/buy/LabelWithValue'
import DropZone from 'components/molecules/DropZone'
import RifCard from 'components/organisms/RifCard'
import StoragePinTabs from 'components/organisms/storage/buy/StoragePinTabs'
import { Button, colors } from '@rsksmart/rif-ui'

const StorageOffersCheckoutPage = () => (
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
            value="Provider.RSK"
          />
        </GridItem>
        <GridItem>
          <LabelWithValue
            label="System"
            value="IPFS"
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
      <GridColumn alignContent="center">
        <GridItem>
          <RifCard
            Header={() => (
              <StoragePinTabs
                onChange={() => { console.log('Changed tab') }}
              />
            )}
            Actions={() => (
              <Button
                style={{
                  background: colors.primary,
                  color: colors.gray1,
                }}
              >
                Upload
              </Button>
            )}
          >
            <GridColumn
              justify="space-evenly"
            >
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
            </GridColumn>
          </RifCard>
        </GridItem>
      </GridColumn>
    </GridColumn>
  </CheckoutPageTemplate>
)

export default StorageOffersCheckoutPage

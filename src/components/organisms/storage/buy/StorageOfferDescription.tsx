import React, { FC } from 'react'
import { Big } from 'big.js'
import { Box, makeStyles, Typography } from '@material-ui/core'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import LabelWithValue from 'components/atoms/LabelWithValue'
import { StorageCheckoutOrder, StoragePinnedContent } from 'context/storage/buy/checkout'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { shortChecksumAddress } from 'utils/stringUtils'

type Props = StorageCheckoutOrder & StoragePinnedContent

const useItemsStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'start',
  },
}))

const StorageOrderDescription: FC<{order: Props}> = ({ order }) => {
  const itemClasses = useItemsStyles()

  const {
    size: contentSize,
    hash: contentHash,
    id,
    system,
  } = order

  return (
    <>
      <GridRow spacing={3}>
        <GridItem xs={3}>
          <Typography
            variant="subtitle1"
            color="primary"
            align="right"
          >
            Selected storage provider
          </Typography>
        </GridItem>
        <GridItem xs={9}>
          <GridRow spacing={3}>
            <GridItem xs={4} classes={itemClasses}>
              <LabelWithValue
                label="Name:"
                value={shortChecksumAddress(id)}
              />
            </GridItem>
            <GridItem xs={4} classes={itemClasses}>
              <LabelWithValue
                label="System:"
                value={system}
              />
            </GridItem>
          </GridRow>
        </GridItem>
      </GridRow>
      {contentHash && contentSize
        ? (
          <GridRow spacing={3}>
            <GridItem xs={3}>
              <Typography
                variant="subtitle1"
                color="primary"
                align="right"
              >
                Uploaded content
              </Typography>
            </GridItem>
            <GridItem xs={9}>
              <GridRow spacing={3}>
                <GridItem xs={4} classes={itemClasses}>

                  <LabelWithValue
                    label="Hash:"
                    value={shortChecksumAddress(contentHash)}
                  />
                </GridItem>
                <GridItem xs={4} classes={itemClasses}>
                  <LabelWithValue
                    label="Size:"
                    value={`${Big(contentSize).div(UNIT_PREFIX_POW2.MEGA).toPrecision(6)} MB`}
                  />
                </GridItem>
              </GridRow>
            </GridItem>
          </GridRow>
        )
        : (
          <GridRow>
            <GridItem xs={12}>
              <Typography color="textPrimary" component="div">
                <Box display="inline" fontWeight="fontWeightMedium">
                  The size of your storage plan is calculated by the content that you upload/persist in this first step.
                </Box>
              </Typography>
            </GridItem>
          </GridRow>
        )}
    </>
  )
}

export default StorageOrderDescription

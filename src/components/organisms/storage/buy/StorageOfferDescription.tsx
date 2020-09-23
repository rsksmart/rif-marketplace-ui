import { Box, Typography } from '@material-ui/core'
import { shortenString } from '@rsksmart/rif-ui'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import LabelWithValue from 'components/atoms/LabelWithValue'
import { Order, PinnedContent } from 'components/pages/storage/buy/CheckoutContext'
import React, { FC } from 'react'

type Props = Order & PinnedContent

const StorageOrderDescription: FC<{order: Props}> = ({ order }) => {
  const {
    name: contentName,
    size: contentSize,
    hash: contentHash,
    id,
    system,
  } = order

  return (
    <GridItem>
      <GridRow>
        <GridItem>
          <Typography
            variant="subtitle1"
            color="primary"
          >
            Selected storage provider
          </Typography>
        </GridItem>
        <GridItem>
          <LabelWithValue
            label=""
            value={shortenString(id)}
          />
        </GridItem>
        <GridItem>
          <LabelWithValue
            label="System"
            value={system}
          />
        </GridItem>
      </GridRow>
      {contentHash && contentSize && contentName
        ? (
          <GridRow>
            <GridItem>
              <Typography
                variant="subtitle1"
                color="primary"
              >
                Uploaded content
              </Typography>
            </GridItem>
            <GridItem>
              <LabelWithValue
                label="Name:"
                value={contentName}
              />
            </GridItem>
            <GridItem>
              <LabelWithValue
                label="Hash:"
                value={shortenString(contentHash)}
              />
            </GridItem>
            <GridItem>
              <LabelWithValue
                label="Size:"
                value={contentSize}
              />
            </GridItem>
          </GridRow>
        )
        : (
          <GridRow>
            <GridItem>
              <Typography color="textPrimary" component="div">
                <Box display="inline" fontWeight="fontWeightMedium">
                  The size of your storage plan is calculated by the content that you upload/persist in this first step.
                </Box>
              </Typography>
            </GridItem>
          </GridRow>
        )}
    </GridItem>
  )
}

export default StorageOrderDescription

import React, { FC } from 'react'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import RoundBtn from 'components/atoms/RoundBtn'
import { Typography } from '@material-ui/core'
/* eslint-disable-next-line import/no-unresolved */
import { ButtonProps } from '@rsksmart/rif-ui/dist/components/atoms/Button'

type Props = ButtonProps & {
  sizeOverLimitMB: string | false
  maxSizeMB: string
}
const StorageUploadAction: FC<Props> = ({
  sizeOverLimitMB,
  maxSizeMB,
  ...actionProps
}) => (
  <GridColumn alignItems="center" alignContent="center" spacing={2}>
    <GridItem xs={12}>
      <RoundBtn {...actionProps} />
    </GridItem>
    {Boolean(sizeOverLimitMB) &&
        (
          <Typography variant="caption" color="error">
            Max upload size is
            {' '}
            {maxSizeMB}
            {' '}
            MB. Remove
            {' '}
            {sizeOverLimitMB}
            {' '}
            MB to continue.
          </Typography>
        )}
  </GridColumn>
)

export default StorageUploadAction

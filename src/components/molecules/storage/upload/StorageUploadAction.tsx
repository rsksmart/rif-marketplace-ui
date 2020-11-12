import React, { FC } from 'react'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import RoundBtn from 'components/atoms/RoundBtn'
import { Typography } from '@material-ui/core'
/* eslint-disable-next-line import/no-unresolved */
import { ButtonProps } from '@rsksmart/rif-ui/dist/components/atoms/Button'

type Props = ButtonProps & {
  sizeOverflow: string | false | undefined
  maxSize: string
}
const StorageUploadAction: FC<Props> = ({
  sizeOverflow,
  maxSize,
  ...actionProps
}) => (
  <GridColumn alignItems="center" alignContent="center" spacing={2}>
    <GridItem xs={12}>
      <RoundBtn {...actionProps} />
    </GridItem>
    {Boolean(sizeOverflow)
        && (
          <Typography variant="caption" color="error">
            Max upload size is
            {' '}
            {maxSize}
            {' '}
            MB. Remove
            {' '}
            {sizeOverflow}
            {' '}
            MB to continue.
          </Typography>
        )}
  </GridColumn>
)

export default StorageUploadAction

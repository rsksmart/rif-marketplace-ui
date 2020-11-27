import React, { FC } from 'react'
import { ButtonProps, Typography } from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import RoundBtn from 'components/atoms/RoundBtn'
import DoneIcon from '@material-ui/icons/Done'
import { UploadResponse } from 'api/rif-storage-upload-service/upload/interfaces'

type Props = ButtonProps & {
  uploadResponse?: UploadResponse
}

const StorageUploaded: FC<Props> = ({
  uploadResponse,
  ...pinActionProps
}) => (
  <GridColumn
    justify="center"
    alignItems="center"
  >
    <GridItem>
      <DoneIcon fontSize="large" htmlColor={colors.primary} />
    </GridItem>
    <GridItem>
      <Typography variant="body1" color="primary">File was uploaded successfully!</Typography>
    </GridItem>
    <GridItem>
      <Typography variant="subtitle1" color="secondary">The hash of your upload is:</Typography>
    </GridItem>
    <GridItem>
      <Typography variant="caption" color="secondary">{uploadResponse?.fileHash}</Typography>
    </GridItem>
    <RoundBtn
      {...pinActionProps}
    />
  </GridColumn>
)

export default StorageUploaded

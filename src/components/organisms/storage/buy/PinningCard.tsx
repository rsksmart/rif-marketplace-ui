import React, {
  Dispatch, FC, useContext, useEffect, useState,
} from 'react'
import {
  ButtonProps, CircularProgress, InputAdornment, makeStyles, Typography,
} from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import { Big } from 'big.js'
import GridColumn from 'components/atoms/GridColumn'
import PinEnterInfoTab from 'components/molecules/storage/buy/PinEnterInfoTab'
import PinUploaderTab from 'components/molecules/storage/buy/PinUploaderTab'
import StorageUploadAction from 'components/molecules/storage/upload/StorageUploadAction'
import StorageUploaded from 'components/molecules/storage/upload/StorageUploaded'
import RifCard from 'components/organisms/RifCard'
import withStorageUploadContext, { StorageUploadContext } from 'context/Services/storage/upload'
import { StorageCheckoutAction } from 'context/storage/buy/checkout'
import { parseConvertBig } from 'utils/parsers'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import RoundBtn from 'components/atoms/RoundBtn'
import { validateCID } from 'utils/cidUtils'
import { UploadResponse } from 'api/rif-storage-upload-service/upload/interfaces'
import StoragePinTabs from './StoragePinTabs'

const UNIT = UNIT_PREFIX_POW2.MEGA
const UNIT_BYTES = `${UNIT_PREFIX_POW2[UNIT][0]}B`

type Props = {
    dispatch: Dispatch<StorageCheckoutAction>
}

const useActionButtonStyles = makeStyles(() => ({
  disabled: {
    background: colors.gray1,
  },
}))

const TOTAL_SIZE_LIMIT = UNIT_PREFIX_POW2.GIGA
const CID_PREFIX = '/ipfs/'

const hashErrorEndorment = (): JSX.Element => (
  <InputAdornment position="end">
    <Typography variant="caption" color="error">
      Invalid CID
    </Typography>
  </InputAdornment>
)

const PinningCard: FC<Props> = ({ dispatch }) => {
  const actionBtnClasses = useActionButtonStyles()

  const {
    state: {
      status: {
        uploadResponse,
        inProgress,
        isDone,
      },
    },
    asyncActions: {
      uploadFiles,
      getFileSize,
    },
  } = useContext(StorageUploadContext)

  // TODO: extract into context
  const [isUpladed, setIsUploaded] = useState(false)
  const [size, setSize] = useState(Big(0))
  const [hash, setHash] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploadDisabled, setUploadDisabled] = useState(false)

  const isHashEmpty = !hash
  const isValidCID = isHashEmpty ? false : validateCID(hash)
  const sizeUnit = size.div(UNIT)
  const hasSize = size.gt(0)

  const getSize = async (): Promise<void> => {
    const fileSize = await getFileSize(hash)

    if (fileSize) setSize(fileSize)
  }

  const handlePinning = (): void => {
    // Update context
    dispatch({
      type: 'SET_PINNED',
      payload: {
        size,
        hash: `${CID_PREFIX}${hash}`,
      },
    })
  }

  const onHashChange = ({ target: { value } }): void => {
    setHash(value.replace(/^(\/*ipfs\/)/, ''))
  }

  const onFilesChange = (addedFiles: File[]): void => {
    const totalB = new Big(addedFiles.reduce((
      acc, file,
    ) => acc + file.size, 0))

    setSize(totalB)
    setUploadDisabled(!!addedFiles.length
                && totalB.gt(TOTAL_SIZE_LIMIT))
    setFiles(addedFiles)
  }

  useEffect(() => {
    if (uploadResponse) {
      const { fileHash, fileSize } = uploadResponse
      setHash(fileHash)
      setSize(new Big(fileSize))
    }
  }, [uploadResponse])

  const handleUpload = (): void => {
    if (files.length) {
      uploadFiles(files)
    }
  }
  const pinActionProps: ButtonProps = {
    children: !hasSize ? 'Get size' : 'Pin',
    onClick: !hasSize ? getSize : handlePinning,
    disabled: !isValidCID,
    classes: actionBtnClasses,
  }
  const uploadActionProps: ButtonProps = {
    children: `Upload ${hasSize ? `${sizeUnit.toFixed(3)} ${UNIT_BYTES}` : ''}`,
    onClick: handleUpload,
    disabled: uploadDisabled,
    classes: actionBtnClasses,
  }

  const sizeOverLimitMB = uploadDisabled
    && hasSize
    && parseConvertBig(
      size.minus(TOTAL_SIZE_LIMIT),
      UNIT_PREFIX_POW2.MEGA,
    ).toFixed(3)

  const renderUploadProgress = (): JSX.Element => {
    if (inProgress) {
      return (
        <GridColumn
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <CircularProgress />
        </GridColumn>
      )
    }

    if (isDone) {
      return <StorageUploaded {...{ uploadResponse: uploadResponse as UploadResponse, ...pinActionProps }} />
    }
    return (
      <StorageUploadAction
        sizeOverLimitMB={sizeOverLimitMB}
        maxSizeMB={parseConvertBig(TOTAL_SIZE_LIMIT,
          UNIT_PREFIX_POW2.MEGA).toString()}
        classes={actionBtnClasses}
        {...uploadActionProps}
      />
    )
  }

  const renderPinBtn = (): JSX.Element => (
    <RoundBtn
      classes={actionBtnClasses}
      {...pinActionProps}
    />
  )

  return (
    <RifCard
      Header={(): JSX.Element => (
        <StoragePinTabs
          onChange={(_, value): void => setIsUploaded(value as boolean)}
          value={isUpladed}
        />
      )}
      Actions={isUpladed ? renderPinBtn : renderUploadProgress}
    >
      {isUpladed
        ? (
          <PinEnterInfoTab
            unit={UNIT_BYTES}
            size={{
              value: sizeUnit,
            }}
            hash={{
              value: hash,
              onChange: onHashChange,
              error: isHashEmpty || !isValidCID,
              InputProps: {
                startAdornment: <InputAdornment position="start">{CID_PREFIX}</InputAdornment>,
                endAdornment: isValidCID ? undefined : hashErrorEndorment(),
              },
            }}
          />
        ) : (
          <PinUploaderTab
            onChange={onFilesChange}
            filesLimit={666 * 666 * 666}
            maxFileSize={Big(TOTAL_SIZE_LIMIT).minus(size).toNumber()}
          />
        )}
    </RifCard>
  )
}

export default withStorageUploadContext(PinningCard)

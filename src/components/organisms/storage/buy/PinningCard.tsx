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
import { validateCID } from 'utils/stringUtils'
import StoragePinTabs from './StoragePinTabs'

type Props = {
    dispatch: Dispatch<StorageCheckoutAction>
}

function setInfoHandle<T>(
  setterFn: React.Dispatch<React.SetStateAction<T>>,
) {
  return ({ target: { value } }): void => setterFn(value as T)
}

const useActionButtonStyles = makeStyles(() => ({
  disabled: {
    background: colors.gray1,
  },
}))

const TOTAL_SIZE_LIMIT = UNIT_PREFIX_POW2.GIGA

const hashErroEndorment = (): JSX.Element => (
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
        hash: uploadedHash,
        inProgress,
        isDone,
      },
    },
    asyncActions: {
      uploadFiles,
    },
  } = useContext(StorageUploadContext)

  // TODO: extract into context
  const [isUpladed, setIsUploaded] = useState(false)
  const [size, setSize] = useState('')
  const [sizeB, setSizeB] = useState(Big(0))
  const [hash, setHash] = useState('')
  const [unit, setUnit] = useState<UNIT_PREFIX_POW2>(UNIT_PREFIX_POW2.MEGA)
  const [files, setFiles] = useState<File[]>([])
  const [uploadDisabled, setUploadDisabled] = useState(false)

  const isHashEmpty = !hash
  const isSizeEmpty = !(size && parseFloat(size))
  const isValidCID = isHashEmpty ? false : validateCID(hash)

  const handlePinning = async (): Promise<void> => {
    // Pin
    await Promise.resolve()
    // Update context
    dispatch({
      type: 'SET_PINNED',
      payload: {
        size,
        unit,
        hash,
      },
    })
  }

  useEffect(() => {
    if (uploadedHash) {
      setHash(uploadedHash)
    }
  }, [uploadedHash])

  const handleUpload = (): void => {
    if (files.length) {
      uploadFiles(files)
    }
  }
  const pinActionProps: ButtonProps = {
    children: 'Pin',
    onClick: handlePinning,
    disabled: isSizeEmpty || !isValidCID,
    classes: actionBtnClasses,
  }
  const uploadActionProps: ButtonProps = {
    children: `Upload ${parseFloat(size) ? `${`${Big(size).toFixed(3)} ${UNIT_PREFIX_POW2[unit][0]}B`}` : ''}`,
    onClick: handleUpload,
    disabled: uploadDisabled,
    classes: actionBtnClasses,
  }

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
      return <StorageUploaded {...{ uploadedHash, ...pinActionProps }} />
    }
    return (
      <StorageUploadAction
        sizeOverLimitMB={Boolean(uploadDisabled && size)
          && parseConvertBig(sizeB.minus(TOTAL_SIZE_LIMIT),
            UNIT_PREFIX_POW2.MEGA).toFixed(3)}
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
      {isUpladed && !isDone
        ? (
          <PinEnterInfoTab
            unit={{ value: unit, onChange: setInfoHandle(setUnit) }}
            size={{
              value: size,
              onChange: setInfoHandle(setSize),
              error: isSizeEmpty,
            }}
            hash={{
              value: hash,
              onChange: setInfoHandle(setHash),
              error: isHashEmpty || !isValidCID,
              InputProps: {
                startAdornment: <InputAdornment position="start">/ipfs/</InputAdornment>,
                endAdornment: isValidCID ? undefined : hashErroEndorment(),
              },
            }}
          />
        ) : (
          <PinUploaderTab
            onChange={(addedFiles): void => {
              const totalB = new Big(addedFiles.reduce((
                acc, file,
              ) => acc + file.size, 0))
              setSizeB(totalB)
              const sizeUnit = totalB.div(unit)
              setUploadDisabled(!!addedFiles.length
                && totalB.gt(TOTAL_SIZE_LIMIT))
              setSize(sizeUnit.toString())
              setFiles(addedFiles)
            }}
            filesLimit={666 * 666 * 666}
            maxFileSize={Big(TOTAL_SIZE_LIMIT).minus(sizeB).toNumber()}
          />
        )}
    </RifCard>
  )
}

export default withStorageUploadContext(PinningCard)

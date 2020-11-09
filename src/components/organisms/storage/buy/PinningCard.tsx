import React, {
  Dispatch, FC, useContext, useEffect, useState,
} from 'react'
import {
  ButtonProps, CircularProgress, makeStyles, Typography,
} from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import { colors } from '@rsksmart/rif-ui'
import { Big } from 'big.js'
import RoundBtn from 'components/atoms/RoundBtn'
import PinEnterInfoTab from 'components/molecules/storage/buy/PinEnterInfoTab'
import PinUploaderTab from 'components/molecules/storage/buy/PinUploaderTab'
import RifCard from 'components/organisms/RifCard'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import withStorageUploadContext, { StorageUploadContext } from 'context/Services/storage/upload'
import { StorageCheckoutAction } from 'context/storage/buy/checkout'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
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

  const [isUpladed, setIsUploaded] = useState(false)
  const [size, setSize] = useState('')
  const [hash, setHash] = useState('')
  const [unit, setUnit] = useState<UNIT_PREFIX_POW2>(UNIT_PREFIX_POW2.MEGA)
  const [files, setFiles] = useState<File[]>([])

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
  const pinActionProps = {
    children: 'Pin',
    onClick: handlePinning,
    disabled: !(size && hash && unit),
  }
  const uploadActionProps = {
    children: `Upload ${parseFloat(size) ? `${`${Big(size).toFixed(3)} ${UNIT_PREFIX_POW2[unit][0]}B`}` : ''}`,
    onClick: handleUpload,
    disabled: !files.length,
  }
  const action: Pick<
  ButtonProps,
  'children' | 'onClick' | 'disabled'
  > = isUpladed ? pinActionProps : uploadActionProps

  const renderUploadProgress = (): JSX.Element => {
    if (inProgress) {
      return (
        <GridColumn
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <CircularProgress />
          <Typography>Uploading file</Typography>
        </GridColumn>
      )
    }

    if (isDone) {
      return (
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
            <Typography variant="caption" color="secondary">{uploadedHash}</Typography>
          </GridItem>
          <RoundBtn
            classes={actionBtnClasses}
            {...pinActionProps}
          />
        </GridColumn>
      )
    }
    return (
      <RoundBtn
        classes={actionBtnClasses}
        {...action}
      />
    )
  }

  return (
    <RifCard
      Header={(): JSX.Element => (
        <StoragePinTabs
          onChange={(_, value): void => setIsUploaded(value as boolean)}
          value={isUpladed}
        />
      )}
      Actions={renderUploadProgress}
    >
      {isUpladed && !isDone
        ? (
          <PinEnterInfoTab
            size={{ value: size, onChange: setInfoHandle(setSize) }}
            hash={{ value: hash, onChange: setInfoHandle(setHash) }}
            unit={{ value: unit, onChange: setInfoHandle(setUnit) }}
          />
        ) : (
          <PinUploaderTab
            onChange={(addedFiles): void => {
              const sizeB = new Big(addedFiles.reduce((
                acc, file,
              ) => acc + file.size, 0))
              const sizeUnit = sizeB.div(unit)
              setSize(sizeUnit.toString())
              setFiles(addedFiles)
            }}
            filesLimit={1}
            maxFileSize={UNIT_PREFIX_POW2.KILO * UNIT_PREFIX_POW2.GIGA}
          />
        )}
    </RifCard>
  )
}

export default withStorageUploadContext(PinningCard)

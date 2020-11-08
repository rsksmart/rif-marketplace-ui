import React, {
  Dispatch, FC, useContext, useState,
} from 'react'
import { ButtonProps, makeStyles } from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import RoundBtn from 'components/atoms/RoundBtn'
import PinEnterInfoTab from 'components/molecules/storage/buy/PinEnterInfoTab'
import PinUploaderTab from 'components/molecules/storage/buy/PinUploaderTab'
import RifCard from 'components/organisms/RifCard'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import withStorageUploadContext, { StorageUploadContext } from 'context/Services/storage/upload'
import { StorageCheckoutAction } from 'context/storage/buy/checkout'
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

  const handleUpload = (): void => {
    if (files) {
      console.log('Uploading files:', files)
      uploadFiles(files)
    }
  }

  const action: Pick<ButtonProps, 'children' | 'onClick' | 'disabled'> = isUpladed
    ? {
      children: 'Pin',
      onClick: handlePinning,
      disabled: !(size && hash && unit),
    }
    : {
      children: 'Upload',
      onClick: handleUpload,
    }

  return (
    <RifCard
      Header={(): JSX.Element => (
        <StoragePinTabs
          onChange={(_, value): void => setIsUploaded(value as boolean)}
          value={isUpladed}
        />
      )}
      Actions={(): JSX.Element => (
        <RoundBtn
          classes={actionBtnClasses}
          {...action}
        />
      )}
    >
      {isUpladed
        ? (
          <PinEnterInfoTab
            size={{ value: size, onChange: setInfoHandle(setSize) }}
            hash={{ value: hash, onChange: setInfoHandle(setHash) }}
            unit={{ value: unit, onChange: setInfoHandle(setUnit) }}
          />
        ) : <PinUploaderTab onChange={setFiles} />}
    </RifCard>
  )
}

export default withStorageUploadContext(PinningCard)

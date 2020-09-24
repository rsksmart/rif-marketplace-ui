import { Button } from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import PinEnterInfoTab from 'components/molecules/storage/buy/PinEnterInfoTab'
import PinUploaderTab from 'components/molecules/storage/buy/PinUploaderTab'
import RifCard from 'components/organisms/RifCard'
import { PurchaseStorageAction } from 'components/pages/storage/buy/CheckoutContext'
import React, { Dispatch, FC, useState } from 'react'
import StoragePinTabs from './StoragePinTabs'

type Props = {
    dispatch: Dispatch<PurchaseStorageAction>
}

const setInfoHandle = (
  setterFn: React.Dispatch<React.SetStateAction<string>>,
) => ({
  target: { value },
}): void => setterFn(value as string)

const PinningCard: FC<Props> = ({ dispatch }) => {
  const [isUpladed, setIsUploaded] = useState(false)
  const [name, setName] = useState('')
  const [size, setSize] = useState('')
  const [hash, setHash] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const handlePinning = async (): Promise<void> => {
    // Pin

    // Update context
    dispatch({
      type: 'SET_PINNED',
      payload: { name, size, hash },
    })
  }

  const handleUpload = async (): Promise<void> => {
    // Upload files

    // Update context
    dispatch({
      type: 'SET_PINNED',
      payload: { name, size, hash },
    })
  }

  return (
    <RifCard
      Header={() => (
        <StoragePinTabs
          onChange={(_, value): void => setIsUploaded(value)}
          value={isUpladed}
        />
      )}
      Actions={() => (
        <Button
          style={{
            background: colors.primary,
            color: colors.gray1,
          }}
          onClick={isUpladed ? handlePinning : handleUpload}
        >
          {isUpladed ? 'Pin' : 'Upload'}

        </Button>
      )}
    >
      {isUpladed
        ? (
          <PinEnterInfoTab
            name={{ value: name, onChange: setInfoHandle(setName) }}
            size={{ value: size, onChange: setInfoHandle(setSize) }}
            hash={{ value: hash, onChange: setInfoHandle(setHash) }}
          />
        ) : <PinUploaderTab onChange={setFiles} />}
    </RifCard>
  )
}

export default PinningCard

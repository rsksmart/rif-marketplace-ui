import { Button } from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import PinEnterInfoTab from 'components/molecules/storage/buy/PinEnterInfoTab'
import PinUploaderTab from 'components/molecules/storage/buy/PinUploaderTab'
import RifCard from 'components/organisms/RifCard'
import { PurchaseStorageAction } from 'components/pages/storage/buy/CheckoutContext'
import React, { Dispatch, FC, useState } from 'react'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import StoragePinTabs from './StoragePinTabs'

type Props = {
    dispatch: Dispatch<PurchaseStorageAction>
}

function setInfoHandle<T>(
  setterFn: React.Dispatch<React.SetStateAction<T>>,
) {
  return function ({ target: { value } }) {
    return setterFn(value as T)
  }
}

const PinningCard: FC<Props> = ({ dispatch }) => {
  const [isUpladed, setIsUploaded] = useState(false)
  const [name, setName] = useState('')
  const [size, setSize] = useState('')
  const [hash, setHash] = useState('')
  const [unit, setUnit] = useState<UNIT_PREFIX_POW2 | 0>(0)
  const [files, setFiles] = useState<File[]>([])

  const handlePinning = async (): Promise<void> => {
    // Pin

    // Update context
    dispatch({
      type: 'SET_PINNED',
      payload: {
        name, size, unit: unit || undefined, hash,
      },
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
            unit={{ value: unit, onChange: setInfoHandle(setUnit) }}
          />
        ) : <PinUploaderTab onChange={setFiles} />}
    </RifCard>
  )
}

export default PinningCard

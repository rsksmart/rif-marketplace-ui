import React, { useContext, useState } from 'react'
import { Web3Store } from '@rsksmart/rif-ui'
import LoginModal from '../atoms/LoginModal'

const WithAccount = ({ WrappedComponent, onChange }) => {
  const {
    state: { account },
  } = useContext(Web3Store)

  const [modalOpened, setModalOpened] = useState(false)

  const handleOnChange = () => {
    if (account) {
      onChange()
    } else {
      setModalOpened(true)
    }
  }

  const onProviderSet = (userAccount) => {
    if (userAccount) {
      onChange()
    }
  }

  return (
    <>
      <LoginModal
        open={modalOpened}
        onProviderSet={onProviderSet}
      />
      <WrappedComponent onChange={handleOnChange} />
    </>
  )
}

export default WithAccount

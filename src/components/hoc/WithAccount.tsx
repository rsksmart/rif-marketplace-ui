import React, { useContext, useState } from 'react'
import { Web3Store } from '@rsksmart/rif-ui'
import LoginModal from '../atoms/LoginModal'

const WithAccount = ({ WrappedComponent, onChange }): JSX.Element => {
  const {
    state: { account },
  } = useContext(Web3Store)

  const [modalOpened, setModalOpened] = useState(false)

  const handleOnChange = (): void => {
    if (account) {
      onChange()
    } else {
      setModalOpened(true)
    }
  }

  const onProviderSet = (userAccount): void => {
    if (userAccount) {
      onChange()
    }
  }

  return (
    <>
      <LoginModal
        open={modalOpened}
        onProviderSet={onProviderSet}
        handleOnClose={() => setModalOpened(false)}
      />
      <WrappedComponent onChange={handleOnChange} />
    </>
  )
}

export default WithAccount

import React, { FC, useState, useEffect } from 'react'
import Web3 from 'web3'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { toChecksumAddress } from '@rsksmart/rsk-utils'
import {
  AccountModal, Button, colors, fonts, NetworkIndicator, shortenString, WrongNetworkModal,
} from '@rsksmart/rif-ui'
import { getConnectionStatus } from 'api/web3/Web3Service'
import ConnectionStatus from 'api/web3/models/Enums'
import NetworkInfo from 'api/web3/models/NetworkInfo'
import ProviderInfo, { EProvider } from 'api/web3/models/ProviderInfo'

const useStyles = makeStyles((theme: Theme) => ({
  accountText: {
    fontSize: fonts.size.tiny,
    textAlign: 'center',
  },
  button: {
    border: `1px solid ${colors.white}`,
    '&:hover': {
      border: `1px solid ${colors.transparent}`,
    },
  },
  networkIndicator: {
    marginRight: theme.spacing(1),
  },
  rightNetwork: {
    padding: theme.spacing(2),
  },
}))

export interface AccountProps {
  requiredNetworkName: string
  setProvider?: (provider: EProvider) => Promise<void>
  web3?: Web3
  networkInfo?: NetworkInfo
  account?: string
  availableProviders?: ProviderInfo[]
  requiredNetworkId?: number
  onCorrectNetworkMessage?: string
  onNetworkMismatchMessage?: string
  noNetworkMessage?: string
  modalInitiallyOpened?: boolean
}

const Account: FC<AccountProps> = (props) => {
  const {
    web3,
    networkInfo,
    account,
    setProvider,
    availableProviders,
    requiredNetworkId,
    onCorrectNetworkMessage,
    onNetworkMismatchMessage,
    noNetworkMessage,
    requiredNetworkName,
    modalInitiallyOpened = false,
  } = props
  const classes = useStyles()

  const [accountModalOpen, setAccountModalOpen] = useState(modalInitiallyOpened)
  const handleAccountModalClose = (): void => setAccountModalOpen(false)
  const handleAccountModalOpen = (): void => setAccountModalOpen(true)
  const [wrongNetModalOpen, setWrongNetModalOpen] = useState(false)
  const openWrongNetModal = (): void => setWrongNetModalOpen(true)
  const closeWrongNetModal = (): void => setWrongNetModalOpen(false)
  const connectionStatus: ConnectionStatus = getConnectionStatus(
    web3, requiredNetworkId, networkInfo?.networkId, account,
  )

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const popoverOpen = Boolean(anchorEl)
  const id = popoverOpen ? 'right-net-popover' : undefined

  const handlePopoverClose = (): void => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.WrongNetwork) {
      openWrongNetModal()
    } else {
      closeWrongNetModal()
      handlePopoverClose()
    }
  }, [connectionStatus])

  const accountText = (): string => {
    if (connectionStatus === ConnectionStatus.LoggedOut) return 'Connect wallet'

    if (connectionStatus === ConnectionStatus.WrongNetwork) return 'Wrong Network'

    if (account) { // means connectionStatus  === ConnectionStatus.LoggedIn
      return shortenString(toChecksumAddress(account, requiredNetworkId))
    }
    return 'Unlock your wallet'
  }

  const onAccountClicked = (event: React.MouseEvent<HTMLButtonElement>): void | null => {
    if (connectionStatus === ConnectionStatus.WrongNetwork) return openWrongNetModal()

    if (connectionStatus === ConnectionStatus.LoggedOut) return handleAccountModalOpen()

    if (connectionStatus === ConnectionStatus.LoggedIn) return setAnchorEl(event.currentTarget)
    return null
  }

  return (
    <>
      <Button
        onClick={onAccountClicked}
        className={classes.button}
        variant="contained"
        color="primary"
        rounded
      >
        {
          !!requiredNetworkId && (
            <NetworkIndicator
              iconClassName={classes.networkIndicator}
              currentNetworkId={networkInfo?.networkId}
              requiredNetworkId={requiredNetworkId}
              onCorrectNetworkMessage={onCorrectNetworkMessage}
              onNetworkMismatchMessage={onNetworkMismatchMessage}
              noNetworkMessage={noNetworkMessage}
            />
          )
        }
        <Typography className={classes.accountText}>
          {accountText()}
        </Typography>
      </Button>
      <Popover
        id={id}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.rightNetwork}>
          {`You are successfully connected to ${networkInfo?.name}.`}
        </Typography>
      </Popover>
      <AccountModal
        open={accountModalOpen}
        onClose={handleAccountModalClose}
        web3={web3}
        onProviderSet={handleAccountModalClose}
        setProvider={setProvider}
        availableProviders={availableProviders}
      />
      <WrongNetworkModal
        open={wrongNetModalOpen}
        onClose={closeWrongNetModal}
        requiredNetworkName={requiredNetworkName}
        currentNetworkName={networkInfo?.name}
      />
    </>
  )
}

export default Account

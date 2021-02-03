import React, { FC, useContext } from 'react'
import ROUTES from 'routes'
/* eslint-disable import/no-unresolved */
import InfoIcon from '@material-ui/icons/Info'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import PeopleIcon from '@material-ui/icons/People'
import StorageIcon from '@material-ui/icons/Storage'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Login from 'components/atoms/Login'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import { colors, Header as RifHeader, Web3Store } from '@rsksmart/rif-ui'
import { NavItemProps, ActionHeaderItemProps } from '@rsksmart/rif-ui/dist/components/organisms/Header/HeaderProps'
import withNotificationsContext, { NotificationsContext } from 'context/Services/notifications'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import { ConfirmationsContext } from 'context/Confirmations'
import NotificationsPopover from './NotificationsPopover'
import TransactionsPopover from './transactions/TransactionsPopover'

const Headers: FC = () => {
  const {
    state: {
      notifications,
    },
  } = useContext(NotificationsContext)
  const {
    state: {
      confirmations,
    },
  } = useContext(ConfirmationsContext)
  const {
    state: { account },
  } = useContext(Web3Store)
  const [
    anchorNotificationsMenu,
    setAnchorNotificationsMenu,
  ] = React.useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorNotificationsMenu(event.currentTarget)
  }

  const [
    anchorTxsPanelMenu,
    setAnchorTxsPanelMenu,
  ] = React.useState<null | HTMLElement>(null)

  const handleTxPanelClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setAnchorTxsPanelMenu(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorNotificationsMenu(null)
  }

  const headerItems: NavItemProps[] = [
    {
      title: 'Domains',
      to: ROUTES.RNS.BASE,
      isActive: (_, {
        pathname,
      }): boolean => pathname.includes(ROUTES.RNS.BASE),
      icon: <PeopleIcon />,
    },
    {
      title: 'Storage',
      to: ROUTES.STORAGE.BASE,
      isActive: (_, {
        pathname,
      }): boolean => pathname.includes(ROUTES.STORAGE.BASE),
      icon: <StorageIcon />,
    },
    {
      title: 'Notifications',
      to: ROUTES.TRIGGERS.BASE,
      isActive: (_, {
        pathname,
      }): boolean => pathname.includes(ROUTES.TRIGGERS.BASE),
      icon: <NotificationsIcon />,
    },
    {
      title: 'About',
      to: ROUTES.ABOUT,
      icon: <InfoIcon />,
    },
    {
      title: 'FAQ',
      to: ROUTES.FAQ,
      icon: <LiveHelpIcon />,
    },
  ]

  const notificationsIcon = (): JSX.Element => (
    notifications.length
      ? <NotificationsActiveIcon htmlColor={colors.white} />
      : <NotificationsNoneIcon htmlColor={colors.white} />
  )

  const showActionItems = Boolean(account)

  const actionItems: ActionHeaderItemProps[] = showActionItems
    ? [
      {
        icon: <IconButton>{notificationsIcon()}</IconButton>,
        onClick: handleClick,
        'aria-haspopup': 'true',
        key: 'notificationsItem',
      },
      {
        icon: (
          <IconButton>
            <Badge
              color="secondary"
              badgeContent={Object.keys(confirmations).length}
            >
              <SyncAltIcon htmlColor={colors.white} />
            </Badge>
          </IconButton>
        ),
        'aria-haspopup': 'true',
        onClick: handleTxPanelClick,
        key: 'txsItem',
      },
    ]
    : []

  return (
    <>
      <RifHeader
        hreflogo={ROUTES.LANDING}
        itemsStart={headerItems}
        itemsEnd={actionItems}
        login={Login}
      />
      <NotificationsPopover
        anchorEl={anchorNotificationsMenu}
        onClose={handleClose}
        notifications={notifications}
        open={Boolean(anchorNotificationsMenu)}
      />
      <TransactionsPopover
        anchorEl={anchorTxsPanelMenu}
        onClose={(): void => setAnchorTxsPanelMenu(null)}
        open={Boolean(anchorTxsPanelMenu)}
        confirmations={confirmations}
      />
    </>
  )
}

export default withNotificationsContext(Headers)

import React, { FC, useContext } from 'react'
import ROUTES from 'routes'
/* eslint-disable import/no-unresolved */
import InfoIcon from '@material-ui/icons/Info'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import PeopleIcon from '@material-ui/icons/People'
import StorageIcon from '@material-ui/icons/Storage'
import Login from 'components/atoms/Login'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import { colors, Header as RifHeader } from '@rsksmart/rif-ui'
import { NavItemProps, ActionHeaderItemProps } from '@rsksmart/rif-ui/dist/components/organisms/Header/HeaderProps'
import withNotificationsContext, { NotificationsContext } from 'context/Services/notifications'
import NotificationsPopover from './NotificationsPopover'

const Headers: FC = () => {
  const {
    state: {
      notifications,
    },
  } = useContext(NotificationsContext)
  const [
    anchorNotificationsMenu,
    setAnchorNotificationsMenu,
  ] = React.useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorNotificationsMenu(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorNotificationsMenu(null)
  }

  const headerItems: NavItemProps[] = [
    {
      title: 'Domains',
      to: ROUTES.RNS.BASE,
      isActive: (_, { pathname }) => pathname.includes(ROUTES.RNS.BASE),
      icon: <PeopleIcon />,
    },
    {
      title: 'Storage',
      to: ROUTES.STORAGE.BASE,
      isActive: (_, { pathname }) => pathname.includes(ROUTES.STORAGE.BASE),
      icon: <StorageIcon />,
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

  const actionItems: ActionHeaderItemProps[] = [
    {
      icon: notifications.length
        ? <NotificationsActiveIcon htmlColor={colors.white} />
        : <NotificationsNoneIcon htmlColor={colors.white} />,
      onClick: handleClick,
      'aria-haspopup': 'true',
    },
  ]

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
    </>
  )
}

export default withNotificationsContext(Headers)

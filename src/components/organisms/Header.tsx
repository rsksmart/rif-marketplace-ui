import React from 'react'
import ROUTES from 'routes'
/* eslint-disable import/no-unresolved */
import InfoIcon from '@material-ui/icons/Info'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import PeopleIcon from '@material-ui/icons/People'
import StorageIcon from '@material-ui/icons/Storage'
import Login from 'components/atoms/Login'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import { colors } from '@rsksmart/rif-ui'
import { HeaderItemProps } from '@rsksmart/rif-ui/dist/components/organisms/Header/HeaderProps'
import withNotificationsContext from 'context/Services/notifications'
import { Header as RUIHeader } from './Header/'
import { ActionHeaderItemProps } from './Header/HeaderProps'

const Header = () => {
  const headerItems: HeaderItemProps[] = [
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

  const hasNotification = true

  const actionItems: ActionHeaderItemProps[] = [
    {
      icon: hasNotification
        ? <NotificationsActiveIcon htmlColor={colors.white} />
        : <NotificationsNoneIcon htmlColor={colors.white} />,
      onClick: () => {},
    },
  ]

  return (
    <RUIHeader
        hreflogo={ROUTES.LANDING}
        itemsStart={headerItems}
        itemsEnd={actionItems}
        login={Login}
    />
  )
}

export default withNotificationsContext(Header)

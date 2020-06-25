import React from 'react'
import ROUTES from 'routes'
import { Header as RUIHeader } from '@rsksmart/rif-ui'
/* eslint-disable import/no-unresolved */
import { HeaderItemProps } from '@rsksmart/rif-ui/dist/components/organisms/Header/HeaderProps'
import InfoIcon from '@material-ui/icons/Info'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import PeopleIcon from '@material-ui/icons/People'
import StorageIcon from '@material-ui/icons/Storage'
import Login from 'components/atoms/Login'

const Header = () => {
  const headerItems: HeaderItemProps[] = [
    {
      title: 'Domains',
      to: ROUTES.DOMAINS.BASE,
      isActive: (_, { pathname }) => pathname.includes(ROUTES.DOMAINS.BASE),
      icon: <PeopleIcon />,
    },
    {
      title: 'Storage',
      to: ROUTES.STORAGE.BUY,
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

  return (<RUIHeader hreflogo={ROUTES.LANDING} items={headerItems} login={Login} />)
}

export default Header

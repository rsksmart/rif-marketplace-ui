import { NavLinkProps } from 'react-router-dom'
import { DOMAttributes, ReactElement } from 'react'

export interface HeaderProps {
  hreflogo: string
  itemsStart: NavItemProps[]
  itemsEnd?: ActionHeaderItemProps[]
  login: React.ElementType
}

export type NavItemProps = NavLinkProps & NavHeaderItemProps

export type NavHeaderItemProps = {
  icon?: ReactElement
  title: string
}

export type ActionHeaderItemProps = {
    icon: ReactElement
  } & Pick<DOMAttributes<HTMLElement>, 'onClick'>

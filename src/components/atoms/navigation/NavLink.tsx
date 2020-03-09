import React, { FC } from 'react'
import BSNavLink, {
  NavLinkProps as BSNavLinkProps,
} from 'react-bootstrap/NavLink'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'


interface Props extends BSNavLinkProps {
  text: string
}

export type NavLinkProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & Props>


const NavLink: FC<NavLinkProps> = ({ text, ...rest }) => (
  <BSNavLink {...rest}>{text}</BSNavLink>
)

export default NavLink

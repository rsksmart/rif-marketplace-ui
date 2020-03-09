import React, { FC } from 'react'
import { LinkContainer as BSLinkContainer } from 'react-router-bootstrap'
import { NavLinkProps } from 'react-router-dom'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'


export type LinkContainerProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & NavLinkProps>

const LinkContainer: FC<LinkContainerProps> = ({ children, ...props }) => (
  <BSLinkContainer {...props}>{children}</BSLinkContainer>
)

export default LinkContainer

import React, { FC } from 'react'

import {
  ListGroup as BSListGroup,
  ListGroupItemProps as BSListGroupItemProps
} from 'react-bootstrap'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'


export type ListItemProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BSListGroupItemProps>

const ListItem: FC<ListItemProps> = ({ children, ...rest }) => {
  return <BSListGroup.Item {...rest}>{children}</BSListGroup.Item>
}

export default ListItem

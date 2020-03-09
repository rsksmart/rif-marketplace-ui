import React, { FC } from 'react'
import {
  ListGroup as BSListGroup,
  ListGroupProps as BSListGroupProps,
} from 'react-bootstrap'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'


export type ListProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BSListGroupProps>

const List: FC<ListProps> = ({ children, ...rest }) => {
  return <BSListGroup {...rest}>{children}</BSListGroup>
}

export default List

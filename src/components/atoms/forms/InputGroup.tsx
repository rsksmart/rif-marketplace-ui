import React, { FC } from 'react'
import {
  InputGroup as BSInputGroup,
  InputGroupProps as BSInputGroupProps,
} from 'react-bootstrap'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'

export type InputGroupProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BSInputGroupProps>

const InputGroup: FC<InputGroupProps> = ({ children, ...rest }) => {
  return <BSInputGroup {...rest}>{children}</BSInputGroup>
}

export default InputGroup

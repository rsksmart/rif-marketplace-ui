import React, { FC } from 'react'
import {
  InputGroup as BSInputGroup,
  InputGroupProps as BSInputGroupProps,
} from 'react-bootstrap'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'


export type InputGroupTextProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BSInputGroupProps>

const InputGroupText: FC<InputGroupTextProps> = ({ children, ...props }) => {
  return <BSInputGroup.Text {...props}>{children}</BSInputGroup.Text>
}

export default InputGroupText

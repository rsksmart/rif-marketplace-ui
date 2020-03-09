import React, { FC } from 'react'
import {
  InputGroup as BSInputGroup,
  InputGroupProps as BSInputGroupProps,
} from 'react-bootstrap'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'

export type InputGroupAppendProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BSInputGroupProps>

const InputGroupAppend: FC<InputGroupAppendProps> = ({
  children,
  ...props
}) => {
  return <BSInputGroup.Append {...props}>{children}</BSInputGroup.Append>
}

export default InputGroupAppend

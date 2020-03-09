import React, { FC } from 'react'
import {
  Button as BSButton,
  ButtonProps as BSButtonProps,
} from 'react-bootstrap'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'


export type ButtonProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BSButtonProps>

const Button: FC<ButtonProps> = ({ children, className = '', ...rest }) => {
  return (
    <BSButton className={`btn ${className}`} {...rest}>
      {children}
    </BSButton>
  )
}
export default Button

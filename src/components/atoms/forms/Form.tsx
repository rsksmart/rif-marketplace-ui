import React, { FC } from 'react'
import {
  Form as BSForm,
  FormProps as BSFormProps
} from 'react-bootstrap'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'

export type FormProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BSFormProps>

const Form: FC<FormProps> = ({ children, className, ...props }) => {
  return (
    <BSForm className={`${className}-form`} {...props}>
      {children}
    </BSForm>
  )
}

export default Form

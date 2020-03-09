import React, { FC } from 'react'
import {
  Form,
  FormControlProps as BsFormControlProps,
} from 'react-bootstrap'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'

export type FormControlProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BsFormControlProps>


const FormControl: FC<FormControlProps> = ({ ...rest }) => {
  return <Form.Control {...rest} />
}

export default FormControl
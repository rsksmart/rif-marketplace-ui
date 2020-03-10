import React, { FC } from 'react';
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers';
import { Form, FormCheckProps } from 'react-bootstrap';

export type CheckboxProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & FormCheckProps
>;

const Checkbox: FC<CheckboxProps> = props => {
  return <Form.Check {...props} type="checkbox" />;
};

export default Checkbox;

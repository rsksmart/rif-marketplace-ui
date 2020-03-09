import React, { FC } from 'react';
import { Modal as BSModal, ModalProps as BSModalProps } from 'react-bootstrap';

export interface ModalProps extends BSModalProps {}

const Modal: FC<ModalProps> = ({ children, ...rest }) => {
  return <BSModal {...rest}>{children}</BSModal>;
};

export default Modal;

import React, { FC } from 'react';
import { Modal as MUIModal, ModalProps as MUIModalProps } from '@material-ui/core';

export interface ModalProps extends MUIModalProps { }

const Modal: FC<ModalProps> = ({ children, ...rest }) => {
  return <MUIModal {...rest}>{children}</MUIModal>;
};

export default Modal;

import React, { FC } from 'react';
import { Modal as BSModal } from 'react-bootstrap';
import { ModalHeaderProps as BSModalHeaderProps } from 'react-bootstrap/ModalHeader';

export interface ModalHeaderProps extends BSModalHeaderProps {}

const ModalHeader: FC<ModalHeaderProps> = ({ children, ...props }) => {
  return <BSModal.Header {...props}>{children}</BSModal.Header>;
};

export default ModalHeader;

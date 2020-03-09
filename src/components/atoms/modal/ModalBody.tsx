import React, { FC } from 'react';
import { Modal as BSModal } from 'react-bootstrap';

export interface ModalBodyProps {}

const ModalBody: FC<ModalBodyProps> = ({ children, ...props }) => {
  return <BSModal.Body {...props}>{children}</BSModal.Body>;
};

export default ModalBody;

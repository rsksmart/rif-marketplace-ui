import React, { FC } from 'react';
import { Modal as BSModal } from 'react-bootstrap';

export interface ModalFooterProps {}

const ModalFooter: FC<ModalFooterProps> = ({ children, ...props }) => {
  return <BSModal.Footer {...props}>{children}</BSModal.Footer>;
};

export default ModalFooter;

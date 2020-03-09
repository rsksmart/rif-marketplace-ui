import React, { FC } from 'react';
import { Modal as BSModal } from 'react-bootstrap';

export interface ModalTitleProps {}

const ModalTitle: FC<ModalTitleProps> = ({ children, ...props }) => {
  return <BSModal.Title {...props}>{children}</BSModal.Title>;
};

export default ModalTitle;

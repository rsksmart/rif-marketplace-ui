import React, { FC } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '../atoms';
import { ModalProps } from '../atoms/modal/Modal';

export interface ModalDialogueProps extends ModalProps {
  title: string;
  footer?: React.ReactElement;
}

const ModalDialogue: FC<ModalDialogueProps> = ({
  title,
  footer,
  children,
  ...props
}) => {
  return (
    <Modal {...props}>
      <React.Fragment>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </React.Fragment>
    </Modal>
  );
};

export default ModalDialogue;
